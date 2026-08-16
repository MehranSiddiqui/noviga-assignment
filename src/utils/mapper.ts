import type {
  MappedAsset,
  MappedShift,
  RawAssetNode,
  RawShift,
} from "../types/Interfaces";

export const flattenAssets = (nodes: RawAssetNode[]): MappedAsset[] => {
  let flatList: MappedAsset[] = [];

  if (!nodes || !Array.isArray(nodes)) return flatList;

  for (const node of nodes) {
    flatList.push({
      id: node.id,
      name: node.name || node.codename || "Unknown Asset",
      assetLevelId: node.assetlevel_id,
    });

    if (node.children && node.children.length > 0) {
      flatList = flatList.concat(flattenAssets(node.children));
    }
  }

  return flatList;
};

export const mapShifts = (shifts: RawShift[]): MappedShift[] => {
  const mappedShifts: MappedShift[] = [];

  if (!shifts || !Array.isArray(shifts)) return mappedShifts;

  shifts.forEach((shift) => {
    const timings = shift.shift_timings;
    if (!timings || timings.length === 0) return;

    for (let i = 0; i < timings.length; i++) {
      const startTime = timings[i];
      const endTime = timings[(i + 1) % timings.length];
      const shiftName = `${shift.name} (${startTime} - ${endTime})`;
      mappedShifts.push({
        shiftId: `${shift.id}|${shiftName}`, //By using this we are able to show only one selected shift
        shiftName: shiftName,
        startTime,
        endTime,
        label: shiftName,
      });
    }
  });

  return mappedShifts;
};
