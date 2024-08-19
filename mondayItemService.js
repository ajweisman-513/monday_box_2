import createMondayClient from './httpClients/mondayHttpClient.js';

// Function to get an item's details by its ID
export const getMondayItemDetails = async (itemId) => {
  const client = createMondayClient();

  const query = `
    {
      items(ids: ${itemId}) {
        id
        name
        column_values {
          id
          text
        }
      }
    }
  `;

  try {
    const response = await client.post('', { query });
    return response.data.data.items[0];
  } catch (error) {
    console.error('Error retrieving item details from Monday.com:', error);
    throw error;
  }
};

export const updateMondayItemColumns = async (
  mondayBoardId, 
  mondayItemId, 
  mondayBoxFolderId_columnId, 
  mondayBoxFolderId_columnUpdate,
  mondayBoxLink_columnId,
  mondayBoxLink_columnUpdate
) => {
  const client = createMondayClient();

  const columnValuesString = `
    "{\\\"${mondayBoxFolderId_columnId}\\\": \\\"${mondayBoxFolderId_columnUpdate}\\\",
      \\\"${mondayBoxLink_columnId}\\\": \\\"${mondayBoxLink_columnUpdate}\\\"}"`;

  console.log('columnValuesString 1', columnValuesString)
  const mutation = `
    mutation {
      change_multiple_column_values(
        item_id: ${mondayItemId},
        board_id: ${mondayBoardId},
        column_values: ${columnValuesString}
      ) {
        id
      }
    }
  `;
  //console.log('FINAL mutation', mutation)
  try {
    const response = await client.post('', { query: mutation });
    return response.data;
  } catch (error) {
    console.error('Error updating column in Monday.com:', error);
    throw error;
  }
};
