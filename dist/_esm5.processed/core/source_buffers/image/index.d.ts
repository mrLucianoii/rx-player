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
import { IBifThumbnail } from "../../../parsers/images/bif";
import AbstractSourceBuffer from "../abstract_source_buffer";
export interface IImageTrackSegmentData {
    data: IBifThumbnail[];
    end: number;
    start: number;
    timescale: number;
    type: string;
}
declare class ImageSourceBuffer extends AbstractSourceBuffer<IImageTrackSegmentData> {
    /**
     * @param {Object} data
     */
    _append(data: IImageTrackSegmentData): void;
    _remove(): void;
    _abort(): void;
}
export default ImageSourceBuffer;