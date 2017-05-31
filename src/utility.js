export function areEqual(obj1, obj2) {
	return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
};

// Clone hack.  Should probably be a member function of object.
// JSON is probably not the best way to do this because it prevents adding functions to object.  Stringify can't convert
// them.
export function cloneObject (object) {
  return JSON.parse(JSON.stringify(object));
}
