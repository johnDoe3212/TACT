import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/initializer.tact',
    options: {
        debug: true,
    },
};
