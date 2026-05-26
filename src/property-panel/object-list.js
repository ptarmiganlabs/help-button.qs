/**
 * Helper that fetches the list of objects on the current sheet
 * for the tooltip target dropdown.
 *
 * @module property-panel/object-list
 */

import logger from "../util/logger";

/**
 * Get the list of objects on the current sheet for dropdown population.
 *
 * @param {object} _data - Current data row (unused).
 * @param {object} handler - Property handler (contains app, properties).
 * @returns {Promise<Array<{value: string, label: string}>>} List of sheet objects.
 */
const getObjectList = async (_data, handler) => {
  const { app } = handler;
  logger.debug("Fetching object list for tooltip target dropdown...");

  const excludeTypes = [
    "sheet",
    "story",
    "appprops",
    "loadmodel",
    "dimension",
    "measure",
    "masterobject",
    "qix-system-dimension",
    "helpbutton-qs",
  ];

  const getCurrentSheetId = () => {
    const url = window.location.href;
    const match = url.match(/\/sheet\/([a-zA-Z0-9-]+)/);
    if (match) return match[1];

    try {
      if (window.qlik?.navigation?.getCurrentSheetId) {
        const id = window.qlik.navigation.getCurrentSheetId();
        return typeof id === "string" ? id : id?.id || null;
      }
    } catch {
      /* ignored */
    }

    return null;
  };

  try {
    let infos = await app.getAllInfos();
    const sheetId = getCurrentSheetId();

    if (sheetId) {
      try {
        const sheetObj = await app.getObject(sheetId);
        const sheetLayout = await sheetObj.getLayout();
        let sheetObjectIds = (sheetLayout.cells || []).map((c) => c.name);

        // Include children (e.g. layout containers)
        for (const id of [...sheetObjectIds]) {
          try {
            const obj = await app.getObject(id);
            const layout = await obj.getLayout();
            if (layout.qChildList?.qItems) {
              layout.qChildList.qItems.forEach((child) => {
                sheetObjectIds.push(child.qInfo.qId);
              });
            }
          } catch {
            /* ignored */
          }
        }

        if (sheetLayout.qChildList?.qItems) {
          const childIds = sheetLayout.qChildList.qItems.map(
            (child) => child.qInfo.qId,
          );
          sheetObjectIds = [...new Set([...sheetObjectIds, ...childIds])];
        }

        const filtered = infos.filter((info) =>
          sheetObjectIds.includes(info.qId),
        );
        if (filtered.length > 0) infos = filtered;
      } catch (e) {
        logger.warn("Could not filter by sheet:", e);
      }
    }

    const items = infos
      .filter(
        (info) =>
          !excludeTypes.includes(info.qType) && !info.qType.includes("system"),
      )
      .map((info) => ({
        value: info.qId,
        label: `${info.qTitle || info.qId} (${info.qType})`,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Enrich titles for items that only show the ID
    if (items.length < 100) {
      const enriched = await Promise.all(
        items.map(async (item) => {
          if (item.label.startsWith(item.value)) {
            try {
              const obj = await app.getObject(item.value);
              const layout = await obj.getLayout();
              const title = layout.title || layout.qMeta?.title || item.value;
              const type = layout.qInfo?.qType || "unknown";
              return { value: item.value, label: `${title} (${type})` };
            } catch {
              /* ignored */
            }
          }
          return item;
        }),
      );
      return enriched.sort((a, b) => a.label.localeCompare(b.label));
    }
    return items;
  } catch (err) {
    logger.error("Failed to get object list:", err);
    return [];
  }
};

export default getObjectList;
