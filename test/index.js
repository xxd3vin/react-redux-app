describe('Process environment for tests', () => {
  it('should not be production for React console warnings', () => {
    expect(process.env.NODE_ENV).to.not.equal('production');
  });
});

// Ensure all files in src folder are loaded for proper code coverage analysis.
const srcContext = require.context('../src/components', true, /.*\.js$/);
srcContext.keys().forEach(srcContext);

const testsContext = require.context('.', true, /Spec$/);
testsContext.keys().forEach(testsContext);
