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
import { Observable } from "rxjs";
import { IEventEmitter } from "../../utils/eventemitter";
import { ICompatMediaKeySystemAccess, ICompatMediaKeySystemConfiguration } from "../constants";
import CustomMediaKeySystemAccess from "./keySystemAccess";
declare let requestMediaKeySystemAccess: ((keyType: string, config: ICompatMediaKeySystemConfiguration[]) => Observable<ICompatMediaKeySystemAccess | CustomMediaKeySystemAccess>) | null;
declare type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;
declare type MEDIA_KEY_SESSION_EVENTS = string;
interface ICustomMediaKeyStatusMap {
    readonly size: number;
    forEach(callback: (status: MediaKeyStatus) => void, thisArg?: any): void;
    get(keyId: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer | null): MediaKeyStatus | undefined;
    has(keyId: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer | null): boolean;
}
export interface ICustomMediaKeySession extends IEventEmitter<MEDIA_KEY_SESSION_EVENTS, MediaKeyMessageEvent | Event> {
    readonly closed: Promise<void>;
    expiration: number;
    keyStatuses: ICustomMediaKeyStatusMap;
    sessionId: string;
    onmessage?: (message: MediaKeyMessageEvent) => void;
    onkeystatusesChange?: (evt: Event) => void;
    generateRequest(initDataType: string, initData: ArrayBuffer | TypedArray | DataView | null): Promise<void>;
    load(sessionId: string): Promise<boolean>;
    update(response: ArrayBuffer | TypedArray | DataView | null): Promise<void>;
    close(): Promise<void>;
    remove(): Promise<void>;
}
export interface ICustomMediaKeys {
    _setVideo: (vid: HTMLMediaElement) => void;
    createSession(sessionType?: MediaKeySessionType): ICustomMediaKeySession;
    setServerCertificate(setServerCertificate: ArrayBuffer | TypedArray): Promise<void>;
}
interface IMockMediaKeysConstructor {
    new (ks: string): ICustomMediaKeys;
}
declare let MockMediaKeys: IMockMediaKeysConstructor;
export { MockMediaKeys, requestMediaKeySystemAccess, };