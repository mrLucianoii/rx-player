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

describe("compat - addTextTrack", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should re-use text track on IE / EDGE", () => {
    const fakeTextTrack = {
      id: "textTrack1",
      HIDDEN: "hidden",
      SHOWING: "showing",
    };
    const mockAddTextTrack = jest.fn(() => null);
    const fakeMediaElement = {
      textTracks: [ fakeTextTrack ],
      addTextTrack: mockAddTextTrack,
    };

    jest.mock("../browser_detection", () => ({
      isIEOrEdge: true,
    }));

    const addTextTrack = require("../add_text_track").default;
    const { track, trackElement } = addTextTrack(fakeMediaElement, true);
    expect(trackElement).toBe(undefined);
    expect(track).toBe(fakeTextTrack);
    expect(track.mode).toBe("hidden");
    expect(mockAddTextTrack).not.toHaveBeenCalled();
  });

  it("should add text track if no track on media element on IE / EDGE", () => {
    const fakeTextTrack = {
      id: "textTrack1",
      HIDDEN: "hidden",
      SHOWING: "showing",
    };
    const fakeTextTracks: any[] = [];
    const mockAddTextTrack = jest.fn(() => {
      fakeTextTracks.push(fakeTextTrack);
      return fakeTextTrack;
    });

    const fakeMediaElement = {
      textTracks: fakeTextTracks,
      addTextTrack: mockAddTextTrack,
    };

    jest.mock("../browser_detection", () => ({
      isIEOrEdge: true,
    }));

    const addTextTrack = require("../add_text_track").default;
    const { track, trackElement } = addTextTrack(fakeMediaElement, false);
    expect(trackElement).toBe(undefined);
    expect(track).toBe(fakeTextTrack);
    expect(fakeMediaElement.textTracks.length).toBe(1);
    expect(fakeMediaElement.textTracks[0]).toBe(fakeTextTrack);
    expect(track.mode).toBe("showing");
    expect(mockAddTextTrack).toHaveBeenCalledTimes(1);
  });

  it("should create showing trackElement and set track on mediaElement", () => {
    jest.mock("../browser_detection", () => ({
      isIEOrEdge: false,
    }));

    const fakeTextTrack = {
      id: "textTrack1",
      HIDDEN: "hidden",
      SHOWING: "showing",
    };
    const fakeTextTrackElement = {
      track: fakeTextTrack,
      kind: undefined,
    };

    const fakeTextTracks: any[] = [];
    const fakeChildNodes: any[] = [];

    const mockAppendChild = jest.fn((_trackElement) => {
      fakeChildNodes.push(_trackElement);
      fakeTextTracks.push(_trackElement.track);
    });

    const fakeMediaElement = {
      textTracks: fakeTextTracks,
      appendChild: mockAppendChild,
      childNodes: fakeChildNodes,
    };

    const spyOnCreateElement = jest.spyOn(document, "createElement")
      .mockImplementation(() => fakeTextTrackElement as unknown as HTMLElement);

    const addTextTrack = require("../add_text_track").default;
    const { track, trackElement } = addTextTrack(fakeMediaElement, true);
    expect(track).toBe(fakeTextTrack);
    expect(track.mode).toBe("hidden");
    expect(trackElement).toBe(fakeTextTrackElement);
    expect(fakeMediaElement.textTracks[0]).toBe(fakeTextTrack);
    expect(fakeMediaElement.childNodes[0]).toBe(fakeTextTrackElement);
    expect(spyOnCreateElement).toHaveBeenCalledTimes(1);
    expect(mockAppendChild).toHaveBeenCalledTimes(1);
    spyOnCreateElement.mockReset();
  });

  it("should create hidden trackElement and set track on mediaElement", () => {
    jest.mock("../browser_detection", () => ({
      isIEOrEdge: false,
    }));

    const fakeTextTrack = {
      id: "textTrack1",
      HIDDEN: "hidden",
      SHOWING: "showing",
    };
    const fakeTextTrackElement = {
      track: fakeTextTrack,
      kind: undefined,
    };

    const fakeTextTracks: any[] = [];
    const fakeChildNodes: any[] = [];

    const mockAppendChild = jest.fn((_trackElement) => {
      fakeChildNodes.push(_trackElement);
      fakeTextTracks.push(_trackElement.track);
    });

    const fakeMediaElement = {
      textTracks: fakeTextTracks,
      appendChild: mockAppendChild,
      childNodes: fakeChildNodes,
    };

    const spyOnCreateElement = jest.spyOn(document, "createElement")
      .mockImplementation(() => fakeTextTrackElement as unknown as HTMLElement);

    const addTextTrack = require("../add_text_track").default;
    const { track, trackElement } = addTextTrack(fakeMediaElement, false);
    expect(track).toBe(fakeTextTrack);
    expect(track.mode).toBe("showing");
    expect(trackElement).toBe(fakeTextTrackElement);
    expect(fakeMediaElement.textTracks[0]).toBe(fakeTextTrack);
    expect(fakeMediaElement.childNodes[0]).toBe(fakeTextTrackElement);
    expect(spyOnCreateElement).toHaveBeenCalledTimes(1);
    expect(mockAppendChild).toHaveBeenCalledTimes(1);
    spyOnCreateElement.mockReset();
  });
});
