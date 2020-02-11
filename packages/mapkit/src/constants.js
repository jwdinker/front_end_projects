export const DISPLAY_PRIORITY = {
  LOW: 250,
  HIGH: 750,
  REQUIRED: 1000,
};

export const MAPKIT_INITIALIZATION_EVENTS = {
  CONFIGURATION_CHANGE: 'configuration-change',
  ERROR: 'error',
};

export const MAPKIT_EVENT_STATUSES = {
  INITIALIZED: 'Initialized',
  REFRESHED: 'Refreshed',
  UNAUTHORIZED: 'Unauthorized',
  TOO_MANY_REQUEST: 'Too Many Requests',
};

export const MAP_DISPLAY_EVENT_NAMES = {
  REGION_CHANGE_START: 'region-change-start', // The map's visible region is about to change.
  REGION_CHANGE_END: 'region-change-end', // The map's visible region was changed.
  SCROLL_START: 'scroll-start', // The map is about to scroll as a result of user interaction.
  SCROLL_END: 'scroll-end', // The map was scrolled as a result of user interaction.
  ZOOM_START: 'zoom-start', // The map is about to zoom as a result of user interaction.
  ZOOM_END: 'zoom-end', // The map was zoomed as a result of user interaction.
};

export const ANNOTATION_AND_OVERLAY_EVENTS = {
  SELECT: 'select', // An annotation or overlay was selected. The event will have one of these properties:
  DESELECT: 'deselect',
  DRAG_START: 'drag-start',
  DRAGGING: 'dragging',
  DRAG_END: 'drag-end',
};

export const MAP_TYPES = {
  STANDARD: 'standard', // A street map that shows the position of all roads and some road names.
  HYBRID: 'hybrid', // A satellite image of the area with road and road name information layered on top.
  MUTED_STANDARD: 'mutedStandard', // A street map where your data is emphasized over the underlying map details.
  SATELLITE: 'satellite', //A satellite image of the area.
};

export const USER_LOCATION_EVENTS = {
  USER_LOCATION_CHANGE: 'user-location-change',
  USER_LOCATION_ERROR: 'user-location-error',
};

export const USER_LOCATION_ERRORS = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE: 'PERMISSION_UNAVAILABLE',
  TIMEOUT: 'TIMEOUT',
  MAPKIT_NOT_INITALIZED: 'MAPKIT_NOT_INITIALIZED',
};

export const DISTANCES = {
  METRIC: 'metric',
  IMPERIAL: 'imperial',
  ADAPTIVE: 'adaptive',
};

export const COLOR_SCHEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const VISIBILITY = {
  ADAPTIVE: 'adaptive',
  HIDDEN: 'hidden',
  VISIBLE: 'visible',
};
