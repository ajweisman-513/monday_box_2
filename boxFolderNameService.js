export const processFolderName = (name) => {
    // Split the name into parts
    let nameParts = name.trim().split(' ');

    // Capitalize the first letter of each name part
    nameParts = nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());

    // Extract the last name (always the final part)
    const lastName = nameParts.pop();

    // Combine the parts in the desired order: "last, first second"(if exists), etc.
    const orderedName = `${lastName}, ${nameParts.join(' ')}`;
    return orderedName.trim();
};
