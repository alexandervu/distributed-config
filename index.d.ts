// Type definitions for DistConf 1.0
// Project: https://github.com/alexanderVu/distributed-config
// Definitions by: Alexander Vu <alexander.vu.tuyet@gmail.com>
// Definitions: 
// TypeScript Version: 2.8

/* =================== USAGE ===================

    import * as DistConf from "distconf"
    const config = new DistConf()

    const myValue = config.get("path.to.myValue");

 =============================================== */

declare class DistConf {
  private readonly options: { [key:string]: any };

  constructor(options?: { [key:string]: any });
  set(key:string, value:any): DistConf;
  has(key:string): boolean;
  get(key: string, defaultValue?: any): any;
  clean(): DistConf;
  store(): object;
  load(path?: string): DistConf;
  getConfigSources(): string[];
  getEnvironment(): string;
  setEnvironment(env:string): DistConf;
  getConfigDirs(): string[];
  setConfigDirs(dirs: string|string[]): DistConf;
  setHostname(hostname?: string): DistConf;
  getHostname(): string;
  importFile(file: string, dir: string, namespace: string): DistConf;
}

declare namespace DistConf {}

export = DistConf;
