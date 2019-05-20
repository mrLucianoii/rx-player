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
import { ICustomError } from "../../errors";
import Manifest from "../../manifest";
import ABRManager from "../abr";
import { IRepresentationChangeEvent } from "../buffer/types";
import { IStallingItem } from "./stalling_manager";
export interface IStreamClockTick {
    currentTime: number;
    buffered: TimeRanges;
    duration: number;
    bufferGap: number;
    state: string;
    playbackRate: number;
    currentRange: {
        start: number;
        end: number;
    } | null;
    readyState: number;
    paused: boolean;
    stalled: {
        reason: "seeking" | "not-ready" | "buffering";
        timestamp: number;
    } | null;
}
export interface IManifestReadyEvent {
    type: "manifestReady";
    value: {
        abrManager: ABRManager;
        manifest: Manifest;
    };
}
export interface IStreamWarningEvent {
    type: "warning";
    value: Error | ICustomError;
}
export interface IManifestUpdateEvent {
    type: "manifestUpdate";
    value: {
        manifest: Manifest;
    };
}
export interface IReloadingStreamEvent {
    type: "reloading-stream";
    value: undefined;
}
export interface ISpeedChangedEvent {
    type: "speedChanged";
    value: number;
}
export interface IStalledEvent {
    type: "stalled";
    value: IStallingItem | null;
}
export interface IStreamLoadedEvent {
    type: "loaded";
    value: true;
}
export { IRepresentationChangeEvent };