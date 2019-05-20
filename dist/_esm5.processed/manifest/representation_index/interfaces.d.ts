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
export interface ISmoothInitSegmentPrivateInfos {
    codecPrivateData?: string;
    bitsPerSample?: number;
    channels?: number;
    packetSize?: number;
    samplingRate?: number;
    protection?: {
        keyId: string;
        keySystems: Array<{
            systemId: string;
            privateData: Uint8Array;
        }>;
    };
}
export interface IPrivateInfos {
    smoothInit?: ISmoothInitSegmentPrivateInfos;
}
export interface ISegment {
    id: string;
    isInit: boolean;
    time: number;
    timescale: number;
    mediaURL: string | null;
    duration?: number;
    indexRange?: [number, number];
    number?: number;
    range?: [number, number];
    timestampOffset?: number;
    privateInfos?: IPrivateInfos;
}
export interface IRepresentationIndexSegmentInfos {
    duration: number;
    time: number;
    timescale: number;
}
export default interface IRepresentationIndex {
    /**
     * Returns Segment object allowing to do the Init Segment request.
     * @returns {Object}
     */
    getInitSegment(): ISegment | null;
    /**
     * Returns an array of Segments needed for the amount of time given.
     * @param {number} up
     * @param {number} duration
     * @returns {Array.<Object>}
     */
    getSegments(up: number, duration: number): ISegment[];
    /**
     * Returns true if, from the given situation, the manifest has to be refreshed
     * @param {number} up - Beginning timestamp of what you want
     * @param {number} to - End timestamp of what you want
     * @returns {Boolean}
     */
    shouldRefresh(up: number, to: number): boolean;
    /**
     * Returns the first time position declared in this index, in seconds.
     * Returns undefined if either:
     *   - not known
     *   - nothing is in the index
     * @returns {Number|undefined}
     */
    getFirstPosition(): number | undefined;
    /**
     * Returns the last time position declared in this index, in seconds.
     * Returns undefined if either:
     *   - not known
     *   - nothing is in the index
     * @returns {Number|undefined}
     */
    getLastPosition(): number | undefined;
    /**
     * Checks if the given time - in seconds - is in a discontinuity. That is:
     *   - We're on the upper bound of the current range (end of the range - time
     *     is inferior to the timescale)
     *   - The next range starts after the end of the current range.
     * @param {Number} _time
     * @returns {Number} - If a discontinuity is present, this is the Starting
     * time for the next (discontinuited) range. If not this is equal to -1.
     */
    checkDiscontinuity(time: number): number;
    /**
     * Update the index with another one, such as after a Manifest update.
     * TODO Both this and _addSegments mutate the index. They should not be
     * accessible like that.
     * Think of another implementation?
     * @param {Object} newIndex
     */
    _update(newIndex: IRepresentationIndex): void;
    /**
     * Add new segments to the index, obtained through various other different
     * ways.
     * TODO Both this and _update mutate the index. They should not be accessible
     * like that.
     * Think of another implementation?
     * @param {Array.<Object>} nextSegments
     * @param {Object} currentSegment
     */
    _addSegments(nextSegments: Array<{
        time: number;
        duration: number;
        timescale: number;
        count?: number;
        range?: [number, number];
    }>, currentSegment?: {
        duration?: number;
        time: number;
        timescale?: number;
    }): void;
}