/**
 * Copyright 2015 CANAL+ Group
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Observable, of as observableOf, } from "rxjs";
import { tap } from "rxjs/operators";
import xhr, { fetchIsSupported, } from "../../utils/request";
import warnOnce from "../../utils/warn_once";
import byteRange from "../utils/byte_range";
import checkISOBMFFIntegrity from "../utils/check_isobmff_integrity";
import isWEBMEmbeddedTrack from "../utils/is_webm_embedded_track";
import initSegmentLoader from "./init_segment_loader";
import lowLatencySegmentLoader from "./low_latency_segment_loader";
/**
 * Segment loader triggered if there was no custom-defined one in the API.
 * @param {Object} opt
 * @returns {Observable}
 */
function regularSegmentLoader(url, args, lowLatencyMode) {
    if (args.segment.isInit) {
        return initSegmentLoader(url, args);
    }
    var isWEBM = isWEBMEmbeddedTrack(args.representation);
    if (lowLatencyMode && !isWEBM) {
        if (fetchIsSupported()) {
            return lowLatencySegmentLoader(url, args);
        }
        else {
            warnOnce("DASH: Your browser does not have the fetch API. You will have " +
                "a higher chance of rebuffering when playing close to the live edge");
        }
    }
    var segment = args.segment;
    return xhr({ url: url,
        responseType: "arraybuffer",
        sendProgressEvents: true,
        headers: segment.range !== undefined ?
            { Range: byteRange(segment.range) } :
            undefined });
}
/**
 * Generate a segment loader:
 *   - call a custom SegmentLoader if defined
 *   - call the regular loader if not
 * @param {boolean} lowLatencyMode
 * @param {Function} [customSegmentLoader]
 * @returns {Function}
 */
export default function generateSegmentLoader(_a) {
    var lowLatencyMode = _a.lowLatencyMode, customSegmentLoader = _a.segmentLoader, checkMediaSegmentIntegrity = _a.checkMediaSegmentIntegrity;
    if (checkMediaSegmentIntegrity !== true) {
        return segmentLoader;
    }
    return function (content) { return segmentLoader(content).pipe(tap(function (res) {
        if ((res.type === "data-loaded" || res.type === "data-chunk") &&
            res.value.responseData !== null &&
            !isWEBMEmbeddedTrack(content.representation)) {
            checkISOBMFFIntegrity(new Uint8Array(res.value.responseData), content.segment.isInit);
        }
    })); };
    /**
     * @param {Object} content
     * @returns {Observable}
     */
    function segmentLoader(content) {
        var url = content.url;
        if (url == null) {
            return observableOf({ type: "data-created",
                value: { responseData: null } });
        }
        if (lowLatencyMode || customSegmentLoader === undefined) {
            return regularSegmentLoader(url, content, lowLatencyMode);
        }
        var args = { adaptation: content.adaptation,
            manifest: content.manifest,
            period: content.period,
            representation: content.representation,
            segment: content.segment,
            transport: "dash",
            url: url };
        return new Observable(function (obs) {
            var hasFinished = false;
            var hasFallbacked = false;
            /**
             * Callback triggered when the custom segment loader has a response.
             * @param {Object} args
             */
            var resolve = function (_args) {
                if (!hasFallbacked) {
                    hasFinished = true;
                    obs.next({ type: "data-loaded",
                        value: { responseData: _args.data,
                            size: _args.size,
                            duration: _args.duration } });
                    obs.complete();
                }
            };
            /**
             * Callback triggered when the custom segment loader fails
             * @param {*} err - The corresponding error encountered
             */
            var reject = function (err) {
                if (err === void 0) { err = {}; }
                if (!hasFallbacked) {
                    hasFinished = true;
                    obs.error(err);
                }
            };
            var progress = function (_args) {
                if (!hasFallbacked) {
                    obs.next({ type: "progress", value: { duration: _args.duration,
                            size: _args.size,
                            totalSize: _args.totalSize } });
                }
            };
            /**
             * Callback triggered when the custom segment loader wants to fallback to
             * the "regular" implementation
             */
            var fallback = function () {
                hasFallbacked = true;
                var regular$ = regularSegmentLoader(url, content, lowLatencyMode);
                // HACK What is TypeScript/RxJS doing here??????
                /* tslint:disable deprecation */
                // @ts-ignore
                regular$.subscribe(obs);
                /* tslint:enable deprecation */
            };
            var callbacks = { reject: reject, resolve: resolve, progress: progress, fallback: fallback };
            var abort = customSegmentLoader(args, callbacks);
            return function () {
                if (!hasFinished && !hasFallbacked && typeof abort === "function") {
                    abort();
                }
            };
        });
    }
}