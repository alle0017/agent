export interface Actor<T> {
      run(state: T): Promise<T>
}

export abstract class ActorRef<T> implements Actor<T> {
      public abstract run(state: T): Promise<T>;
}