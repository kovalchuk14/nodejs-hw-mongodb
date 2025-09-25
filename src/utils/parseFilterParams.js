const parseType = (type) => {
    const isString = typeof type === 'string';
    if (!isString) return;

    const isType = ['work', 'home', 'personal'].includes(type);
    if (isType) return type;
}

const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
};

export const parseFilterParams = (query) => {
    const { contactType, isFavourite } = query;

    const parsedType = parseType(contactType);
    const parsedIsFavourite = parseBoolean(isFavourite);

    return {
        contactType: parsedType,
        isFavourite: parsedIsFavourite,
    }
}
