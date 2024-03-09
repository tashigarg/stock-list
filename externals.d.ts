/**
 * Copyright (c) 2021, Juniper Networks, Inc.
 *
 * All rights reserved.
 */

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: {
    [propName: string]: any;
  };
  export default content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.less' {
  const content: {
    [propName: string]: any;
  };
  export default content;
}

declare module '*.png' {
  const content: {
    [propName: string]: any;
  };
  export default content;
}
