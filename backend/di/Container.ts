type DIServiceConfig<T> = {
  type: 'singelton' | 'scoped' | 'transient';
  create: (container: Container) => Promise<T>;
  dispose?: (instance: T) => Promise<void>;
}

class Container {
  public static singelton: Container;

  protected serviceConfigs: Map<string, DIServiceConfig<any>>;

  private services: Map<string, any>;

  constructor(serviceConfigs?: Map<string, DIServiceConfig<any>>) {
    this.serviceConfigs = new Map<string, DIServiceConfig<any>>();
    if (serviceConfigs) {
      serviceConfigs.forEach((serviceConfig, name) => {
        this.serviceConfigs.set(name, serviceConfig);
      });
    }
    this.services = new Map<string, any>();
  }

  public addSingelton<T>(name: string, create: (container: Container) => Promise<T>, dispose?: (instance: T) => Promise<void>) {
    this.serviceConfigs.set(name, { create, type: 'singelton', dispose });
    Container.singelton.serviceConfigs.set(name, { create, type: 'singelton', dispose });
  }

  public addScoped<T>(name: string, create: (container: Container) => Promise<T>, dispose?: (instance: T) => Promise<void>) {
    this.serviceConfigs.set(name, { create, type: 'scoped', dispose });
  }

  public addTransient<T>(name: string, create: (container: Container) => Promise<T>, dispose?: (instance: T) => Promise<void>) {
    this.serviceConfigs.set(name, { create, type: 'transient', dispose });
  }

  public createContainer(): Container {
    return new Container(this.serviceConfigs);
  }

  public async get<T>(name: string): Promise<T> {
    // get service config
    const serviceConfig = this.serviceConfigs.get(name) as DIServiceConfig<T>;
    // check if service config exists
    if (!serviceConfig) {
      throw new Error(`Service ${name} not registered`);
    }
    // if service config is singelton and this is not the singelton container, return the singelton container's service
    if (serviceConfig.type === 'singelton' && this !== Container.singelton) {
      return Container.singelton.get<T>(name);
    }
    // try to get service from services map
    let service = this.services.get(name) as T;
    // if service is not found, create it
    if (!service) {
      service = await serviceConfig.create(this);
    }
    // if service config is not transient, add service to services map
    if (serviceConfig.type !== 'transient') {
      this.services.set(name, service);
    }
    // return service
    return service;
  }

  public dispose() {
    this.services.forEach(async (service, name) => {
      // get service config
      const serviceConfig = this.serviceConfigs.get(name) as DIServiceConfig<any>;
      // dispose service
      if (serviceConfig.dispose) {
        await serviceConfig.dispose(service);
      }
    });
    // clear services map
    this.services.clear();
    // clear service configs map
    this.serviceConfigs.clear();
  }
}

Container.singelton = new Container();

export default Container;



