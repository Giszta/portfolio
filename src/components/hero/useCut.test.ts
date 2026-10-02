import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CUT_DEFAULT, CUT_MAX } from "@/lib/cut";
import { useCut } from "./useCut";

describe("useCut", () => {
  it("starts at the default 50/50 section", () => {
    const { result } = renderHook(() => useCut());
    expect(result.current.target).toBe(CUT_DEFAULT);
    expect(result.current.cut.get()).toBe(CUT_DEFAULT);
  });

  it("clamps the value it moves to", () => {
    const { result } = renderHook(() => useCut());
    act(() => result.current.moveTo(140));
    expect(result.current.target).toBe(CUT_MAX);
  });
});
