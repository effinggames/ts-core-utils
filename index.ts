/**
 * Useful for generic functions that need to extend from objects.
 */
export interface ObjectLiteral {
  [key: string]: any;
}

/**
 * Breaks an array into specified chunk sizes.
 * @param array The array to break apart.
 * @param chunkSize What size the chunks should be.
 * @returns Returns an array of arrays.
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const results: T[][] = [];
  const arrayClone = array.slice();
  const numOfChunks = Math.ceil(arrayClone.length / chunkSize);

  for (let i = 0; i < numOfChunks; i++) {
    results.push(arrayClone.splice(0, chunkSize));
  }

  return results;
}

/**
 * Gets the environment variable or throws an error.
 * @param name Name of the env variable.
 * @returns Returns the value of the env variable.
 */
export function getEnvVarOrThrow(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`ENV variable: ${name} is not set!`);
  }

  return value;
}

export function pipe<A, B>(value: A, f1: (value: A) => B): B;
export function pipe<A, B, C>(value: A, f1: (value: A) => B, f2: (value: B) => C): C;
export function pipe<A, B, C, D>(value: A, f1: (value: A) => B, f2: (value: B) => C, f3: (value: C) => D): D;
export function pipe<A, B, C, D, E>(
  value: A,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D,
  f4: (value: D) => E
): E;
export function pipe<A, B, C, D, E, F>(
  value: A,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D,
  f4: (value: D) => E,
  f5: (value: E) => F
): F;
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D,
  f4: (value: D) => E,
  f5: (value: E) => F,
  f6: (value: F) => G
): G;
/**
 * Transforms a value to another value.
 * Shallowly clones if an object or array to avoid mutation.
 * @param value The value to transform.
 * @param mapFunc The transform function.
 * @returns Returns the new value.
 */
export function pipe<T, U>(value: T, ...mapFuncs: ((value: any) => any)[]): U {
  let newValue;

  if (Array.isArray(value)) {
    newValue = value.slice(0);
  } else if (typeof value === 'object' && value.constructor === Object) {
    newValue = { ...value };
  } else {
    newValue = value;
  }

  return mapFuncs.reduce((value, mapFunc) => mapFunc(value), newValue);
}

export function pipeSafely<A, B>(value: A | null | undefined, f1: (value: A) => B): B | undefined;
export function pipeSafely<A, B, C>(
  value: A | null | undefined,
  f1: (value: A) => B,
  f2: (value: B) => C
): C | undefined;
export function pipeSafely<A, B, C, D>(
  value: A | null | undefined,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D
): D | undefined;
export function pipeSafely<A, B, C, D, E>(
  value: A | null | undefined,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D,
  f4: (value: D) => E
): E | undefined;
export function pipeSafely<A, B, C, D, E, F, G>(
  value: A | null | undefined,
  f1: (value: A) => B,
  f2: (value: B) => C,
  f3: (value: C) => D,
  f4: (value: D) => E,
  f5: (value: E) => F,
  f6: (value: F) => G
): G | undefined;
/**
 * Transforms a possibly undefined value to another value.
 * @param value The value to transform.
 * @param mapFunc The transform function.
 * @returns Returns the new possibly undefined value.
 */
export function pipeSafely<T, U>(value: T | null | undefined, ...mapFuncs: ((value: any) => any)[]): U | undefined {
  if (notEmpty(value)) {
    // @ts-ignore
    return pipe(
      value,
      ...mapFuncs
    );
  }
}

/**
 * Gets the possibly undefined value from the callback.
 * If the callback throws an error, then returns undefined.
 * Useful when accessing a dangerous interface or 'any'.
 * @param getCb Callback that accesses the value.
 * @returns Returns the value or undefined.
 */
export function getSafely<T>(getCb: () => T | undefined): T | undefined {
  let result;

  try {
    result = getCb();
  } finally {
    return result;
  }
}

/**
 * Gets the possibly undefined value from the callback.
 * If the callback throws an error or returns undefined, then throws an error.
 * Useful when accessing a dangerous interface or 'any' that's mandatory.
 * @param getCb Callback that accesses the value.
 * @returns Returns the value.
 */
export function getOrThrow<T>(getCb: () => T | undefined): T {
  const result = getSafely(getCb);

  if (result === undefined) {
    throw new Error('getOrThrow - undefined value!');
  }

  return result;
}

/**
 * Gets the possibly undefined value from the callback.
 * If the callback throws an error, then returns the provided default value.
 * Useful when accessing a dangerous interface or 'any'.
 * @param getCb Callback that accesses the value.
 * @param defaultValue Fallback value if the callback errors or returns undefined.
 * @returns Returns the callback value or the default value.
 */
export function getOrElse<T>(getCb: () => T | undefined, defaultValue: T): T {
  let result = getSafely(getCb);

  if (result === undefined) {
    result = defaultValue;
  }

  return result;
}

/**
 * Polyfill for flatten.
 * @param nestedArrays The array of arrays to flatten
 * @returns Returns the flattened array.
 */
export function flatten<T>(nestedArrays: T[][]): T[] {
  return ([] as T[]).concat(...nestedArrays);
}

/**
 * Checks if a value is defined, in a type-safe way.
 * Useful for filtering through arrays.
 * @param value The value to check.
 * @returns Returns true/false if the value is defined.
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Initializes a class and copies over additional properties.
 * @param entityClass The class to initialize.
 * @param partials The properties to copy over to the new object.
 * @returns Returns the new instance.
 */
export function initAndSetProps<T extends ObjectLiteral>(entityClass: { new (): T }, ...partials: Partial<T>[]): T {
  const entity = new entityClass();

  return Object.assign(entity, ...partials);
}

/**
 * Node.js utility functions.
 */

/**
 * Starts a Node.js app with the cluster module
 * @param initCb The callback that starts the app.
 */
export function startAppWithCluster(initCb: () => void): void {
  const cluster = require('cluster');

  if (cluster.isMaster) {
    let cpuCount;

    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode!');
      cpuCount = require('os').cpus().length;
    } else {
      console.warn("Running in development mode, set NODE_ENV to 'production' for multi-core support.");
      cpuCount = 1;
    }

    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker: any) => {
      console.log('Worker %d died :(', worker.id);
      cluster.fork();
    });
  } else {
    initCb();
  }
}

/**
 * Parses a database connection string into easier pieces.
 * Only useable in Node.js environments.
 * @param connectionString Connection string like 'postgres://USER:PASSWORD@DATABASE_URL/DATABASE_NAME'.
 * @returns Returns an object with the connection data.
 */
export function parseConnectionString(
  connectionString: string
): {
  database: string;
  host: string;
  port: number;
  ssl: boolean;
  username: string;
  password: string;
} {
  const params = require('url').parse(connectionString, true);

  params.pathname = params.pathname || '';
  params.hostname = params.hostname || '';
  params.port = params.port || '';
  params.auth = params.auth || '';
  const auth = params.auth.split(':');

  return {
    database: params.pathname.split('/')[1],
    host: params.hostname,
    port: parseInt(params.port, 10),
    ssl: !!params.query.ssl,
    username: auth[0],
    password: auth[1]
  };
}
