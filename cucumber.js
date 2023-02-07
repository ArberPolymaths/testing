let common = [
    'features/**/*.feature', // Specify our feature files
    '--require-module ts-node/register', // Load TypeScript module
    '--require ../testing/src/features/step-definitions/**/*.ts', // Load step definitions
    '--publish-quiet',
].join(' ');
module.exports = {
    default: common,
};
