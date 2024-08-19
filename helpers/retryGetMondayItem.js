export const retryGetMondayItem = async (getMondayItemDetails, mondayItemId) => {
    let attempt = 0;
    const retries = 2
    let mondayItem;
    let itemName;
    let itemBoxFolderId;
    let itemLocationName;
 
    while (attempt <= retries) {
        mondayItem = await getMondayItemDetails(mondayItemId);
        const colVals = mondayItem.column_values;

        itemName = mondayItem.name
        itemBoxFolderId = colVals.find(({ id }) => id === "text0__1")?.text;
        itemLocationName = colVals.find(({ id }) => id === "label__1")?.text;

        if (itemBoxFolderId && itemLocationName) {
            return { itemName, itemBoxFolderId, itemLocationName };
        }

        attempt++;
    }

    return { itemName, itemBoxFolderId, itemLocationName }; // Return the final attempt, even if missing
};
