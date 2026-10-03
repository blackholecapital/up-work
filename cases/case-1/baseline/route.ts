export interface Route { provider: string; model: string; revision: number }
export class Router {
  active: Route = { provider: 'synthetic-a', model: 'assembly-small', revision: 1 };
  snapshot(): Route { return this.active; }
  execute(route: Route): { provider: string; model: string; receipt: string } {
    return { provider: this.active.provider, model: this.active.model, receipt: `${route.provider}/${route.model}@${route.revision}` };
  }
}
