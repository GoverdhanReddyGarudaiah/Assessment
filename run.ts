import Launcher from '@wdio/cli';

const wdio = new Launcher('build/wdio.conf.js', {});

wdio.run().then(
  (exitCode) => {
    process.exit(exitCode);
  },
  (error) => {
    console.error('Launcher failed to start the test', error.stacktrace);
    process.exit(1);
  }
);
