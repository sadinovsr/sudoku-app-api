function compareUserLevels ( userLevel, levelToCompare ) {
  const levels = [ 'user', 'moderator', 'admin' ];
  if ( levels.indexOf( userLevel ) >= levels.indexOf( levelToCompare ) ) {
    return true;
  } else {
    return false;
  }
}

export { compareUserLevels }