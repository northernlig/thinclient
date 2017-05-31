/**
 * Created by medwards on 5/30/2017.
 */
export class ParentPathValueConverter {
  toView(currentPath) {
    // ToDo: Get this working so object-view.js doesn't need to maintain both parentPath and currentPath local variables.
    // Readme: Dead code.  I wanted to use this in object-view.html in place of what's there, the currentPath variable bind.
    // I got it working for the most part, except for within the 'route-href' syntax.  It can't seem to parse it,
    // I must be missing something.  Works fine when i use it elsewhere in the doc.

    let pathParts = currentPath.split ('/');
    if (pathParts.length == 1 || pathParts.length == 2){  // Project selected or channel selected
      return "";
    }

    // New path is everything but the last two parts.  This should work N deep
    let parentPath = pathParts[0];  // Can't include channels because of this.
    for (let i = 1; i < pathParts.length - 2; i++){
      parentPath += '/' + pathParts[i];
    }

    return parentPath;
  }
}
