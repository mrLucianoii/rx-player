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
/**
 * /!\ This file is feature-switchable.
 * It always should be imported through the `features` object.
 */
// srt to VTTCue parser, Done for fun.
// Heavily inspired from the WebVTT implementation
import { makeCue, } from "../../../compat/index";
import getCueBlocks from "./getCueBlocks";
import parseCueBlock from "./parseCue";
/**
 * Parse whole srt file into an array of cues, to be inserted in a video's
 * TrackElement.
 * @param {string} srtStr
 * @param {Number} timeOffset
 * @returns {Array.<VTTCue|TextTrackCue>}
 */
export default function parseSRTStringToVTTCues(srtStr, timeOffset) {
    // Even if srt only authorize CRLF, we will also take LF or CR as line
    // terminators for resilience
    var lines = srtStr.split(/\r\n|\n|\r/);
    var cueBlocks = getCueBlocks(lines);
    var cues = [];
    for (var i = 0; i < cueBlocks.length; i++) {
        var cueObject = parseCueBlock(cueBlocks[i], timeOffset);
        if (cueObject) {
            var nativeCue = toNativeCue(cueObject);
            if (nativeCue) {
                cues.push(nativeCue);
            }
        }
    }
    return cues;
}
/**
 * @param {Object} cue Object
 * @returns {TextTrackCue|VTTCue|null}
 */
function toNativeCue(cueObj) {
    var start = cueObj.start, end = cueObj.end, payload = cueObj.payload;
    var text = payload.join("\n");
    return makeCue(start, end, text);
}