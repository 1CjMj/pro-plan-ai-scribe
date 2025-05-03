/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '../../backend/task_generator_coding' {
    export function generateTasks(description: string): Promise<any>;
}

declare module '../../backend/task_generator_non_coding' {
    export function generateTasks(description: string): Promise<any>;
}