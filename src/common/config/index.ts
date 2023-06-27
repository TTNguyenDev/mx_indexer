import * as yaml from 'js-yaml';
import * as fs from 'fs';

export class Config {
  data: Record<string, any>;
  constructor(filename: string) {
    this.data = yaml.load(fs.readFileSync(filename, 'utf8')) as Record<
      string,
      any
    >;
  }

  getApiUrl(): string {
    const apiUrl = this.data.urls.api;
    if (!apiUrl) {
      throw new Error("No API url present");
    }

    return apiUrl;
  }

  getContractAbiPath(key: string): string {
    console.log(this.data['abi'][key][0]);
    const contractApiPath = this.data['abi'][key][0];
    if (!contractApiPath) {
      throw new Error(`No contract abi path present - ${key}`);
    }
    return contractApiPath;
  }

  getContractAddress(key: string): string {
    const contractAddress = this.data['wallet'][key][0];
    if (!contractAddress) {
      throw new Error(`No contract address present - ${key}`);
    }
    return contractAddress;
  }

  // getContractAddresses(): Record<string, any> {
  //   const contractAddresses =
  //     this.configService.get<Record<string, any>>(`wallet`);
  //   if (!contractAddresses) {
  //     throw new Error("No getContractAddresses present");
  //   }
  //   return contractAddresses;
  // }
  //
  // getSwaggerUrls(): string[] {
  //   const swaggerUrls = this.configService.get<string[]>("urls.swagger");
  //   if (!swaggerUrls) {
  //     throw new Error("No swagger urls present");
  //   }
  //
  //   return swaggerUrls;
  // }
  //
  // getRedisUrl(): string {
  //   const redisUrl = this.configService.get<string>("urls.redis");
  //   if (!redisUrl) {
  //     throw new Error("No redisUrl present");
  //   }
  //
  //   return redisUrl;
  // }
  //
  // getDatabaseHost(): string {
  //   const databaseHost = this.configService.get<string>("database.host");
  //   if (!databaseHost) {
  //     throw new Error("No database.host present");
  //   }
  //
  //   return databaseHost;
  // }
  //
  // getDatabasePort(): number {
  //   const databasePort = this.configService.get<number>("database.port");
  //   if (!databasePort) {
  //     throw new Error("No database.port present");
  //   }
  //
  //   return databasePort;
  // }
  //
  // getDatabaseUsername(): string {
  //   const databaseUsername =
  //     this.configService.get<string>("database.username");
  //   if (!databaseUsername) {
  //     throw new Error("No database.username present");
  //   }
  //
  //   return databaseUsername;
  // }
  //
  // getDatabasePassword(): string {
  //   const databasePassword =
  //     this.configService.get<string>("database.password");
  //   if (!databasePassword) {
  //     throw new Error("No database.password present");
  //   }
  //
  //   return databasePassword;
  // }
  //
  // getDatabaseName(): string {
  //   const databaseName = this.configService.get<string>("database.name");
  //   if (!databaseName) {
  //     throw new Error("No database.name present");
  //   }
  //
  //   return databaseName;
  // }
  //
  // getDatabaseConnection(): {
  //   host: string;
  //   port: number;
  //   username: string;
  //   password: string;
  //   database: string;
  // } {
  //   return {
  //     host: this.getDatabaseHost(),
  //     port: this.getDatabasePort(),
  //     username: this.getDatabaseUsername(),
  //     password: this.getDatabasePassword(),
  //     database: this.getDatabaseName(),
  //   };
  // }
  //
  // getNoSQLDatabaseConnection(): string {
  //   return `mongodb://${this.getDatabaseHost()}:27017/${this.getDatabaseName()}`;
  // }
  //
  // getIsPublicApiFeatureActive(): boolean {
  //   const isApiActive = this.configService.get<boolean>(
  //     "features.publicApi.enabled"
  //   );
  //   if (isApiActive === undefined) {
  //     throw new Error("No public api feature flag present");
  //   }
  //
  //   return isApiActive;
  // }
  //
  // getPublicApiFeaturePort(): number {
  //   const featurePort = this.configService.get<number>(
  //     "features.publicApi.port"
  //   );
  //   if (featurePort === undefined) {
  //     throw new Error("No public api port present");
  //   }
  //
  //   return featurePort;
  // }
  //
  // getIsPrivateApiFeatureActive(): boolean {
  //   const isApiActive = this.configService.get<boolean>(
  //     "features.privateApi.enabled"
  //   );
  //   if (isApiActive === undefined) {
  //     throw new Error("No private api feature flag present");
  //   }
  //
  //   return isApiActive;
  // }
  //
  // getPrivateApiFeaturePort(): number {
  //   const featurePort = this.configService.get<number>(
  //     "features.privateApi.port"
  //   );
  //   if (featurePort === undefined) {
  //     throw new Error("No private api port present");
  //   }
  //
  //   return featurePort;
  // }
  //
  // getIsCacheWarmerFeatureActive(): boolean {
  //   const isCacheWarmerActive = this.configService.get<boolean>(
  //     "features.cacheWarmer.enabled"
  //   );
  //   if (isCacheWarmerActive === undefined) {
  //     throw new Error("No cache warmer feature flag present");
  //   }
  //
  //   return isCacheWarmerActive;
  // }
  //
  // getCacheWarmerFeaturePort(): number {
  //   const featurePort = this.configService.get<number>(
  //     "features.cacheWarmer.port"
  //   );
  //   if (featurePort === undefined) {
  //     throw new Error("No cache warmer port present");
  //   }
  //
  //   return featurePort;
  // }
  //
  // getIsTransactionProcessorFeatureActive(): boolean {
  //   const isTransactionProcessorActive = this.configService.get<boolean>(
  //     "features.transactionProcessor.enabled"
  //   );
  //   if (isTransactionProcessorActive === undefined) {
  //     throw new Error("No transaction processor feature flag present");
  //   }
  //
  //   return isTransactionProcessorActive;
  // }
  //
  // getTransactionProcessorFeaturePort(): number {
  //   const featurePort = this.configService.get<number>(
  //     "features.transactionProcessor.port"
  //   );
  //   if (featurePort === undefined) {
  //     throw new Error("No transaction processor port present");
  //   }
  //
  //   return featurePort;
  // }
  //
  // getTransactionProcessorMaxLookBehind(): number {
  //   const maxLookBehind = this.configService.get<number>(
  //     "features.transactionProcessor.maxLookBehind"
  //   );
  //   if (maxLookBehind === undefined) {
  //     throw new Error("No transaction processor max look behind present");
  //   }
  //
  //   return maxLookBehind;
  // }
  //
  // getIsQueueWorkerFeatureActive(): boolean {
  //   const isQueueWorkerActive = this.configService.get<boolean>(
  //     "features.queueWorker.enabled"
  //   );
  //   if (isQueueWorkerActive === undefined) {
  //     throw new Error("No queue worker feature flag present");
  //   }
  //
  //   return isQueueWorkerActive;
  // }
  //
  // getQueueWorkerFeaturePort(): number {
  //   const featurePort = this.configService.get<number>(
  //     "features.queueWorker.port"
  //   );
  //   if (featurePort === undefined) {
  //     throw new Error("No transaction processor port present");
  //   }
  //
  //   return featurePort;
  // }
  //
  // getSecurityAdmins(): string[] {
  //   const admins = this.configService.get<string[]>("security.admins");
  //   if (admins === undefined) {
  //     throw new Error("No security admins value present");
  //   }
  //
  //   return admins;
  // }
  //
  // getRateLimiterSecret(): string | undefined {
  //   return this.configService.get<string>("rateLimiterSecret");
  // }
  //
  // getAxiosTimeout(): number {
  //   return (
  //     this.configService.get<number>("keepAliveTimeout.downstream") ?? 61000
  //   );
  // }
  //
  // getIsKeepAliveAgentFeatureActive(): boolean {
  //   return this.configService.get<boolean>("keepAliveAgent.enabled") ?? true;
  // }
  //
  // getServerTimeout(): number {
  //   return this.configService.get<number>("keepAliveTimeout.upstream") ?? 60000;
  // }
  //
  // getHeadersTimeout(): number {
  //   return this.getServerTimeout() + 1000;
  // }
  //
  // getUseCachingInterceptor(): boolean {
  //   return this.configService.get<boolean>("useCachingInterceptor") ?? false;
  // }
  //
  // getElasticUrl(): string {
  //   const elasticUrls = this.configService.get<string[]>("urls.elastic");
  //   if (!elasticUrls) {
  //     throw new Error("No elastic urls present");
  //   }
  //
  //   return elasticUrls[Math.floor(Math.random() * elasticUrls.length)];
  // }
  //
  // getPoolLimit(): number {
  //   return this.configService.get<number>("caching.poolLimit") ?? 100;
  // }
  //
  // getProcessTtl(): number {
  //   return this.configService.get<number>("caching.processTtl") ?? 60;
  // }
  //
  // getUseKeepAliveAgentFlag(): boolean {
  //   return this.configService.get<boolean>("flags.useKeepAliveAgent") ?? true;
  // }
  //
  // getIsAuthActive(): boolean {
  //   return this.configService.get<boolean>("api.auth") ?? false;
  // }
  //
  // getNativeAuthMaxExpirySeconds(): number {
  //   return (
  //     this.configService.get<number>("nativeAuth.maxExpirySeconds") ?? 86400
  //   );
  // }
  //
  // getNativeAuthAcceptedOrigins(): string[] {
  //   return this.configService.get<string[]>("nativeAuth.acceptedOrigins") ?? [];
  // }
}