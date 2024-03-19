import {ConfigParams} from './types';
import {PluginInterface, PluginParams} from '../types/interface';
import * as fs from 'node:fs';

export const PrometheusExporter = (
  globalConfig: ConfigParams
): PluginInterface => {
  const metadata = {
    kind: 'execute',
  };

  /**
   * Execute's strategy description here.
   */
  const execute = async (
    inputs: PluginParams[],
    config?: ConfigParams
  ): Promise<PluginParams[]> => {
    const mergedConfig = Object.assign({}, globalConfig, config);

    let outputStr = '';

    inputs.map(input => {
      console.log('input');
      console.log(input);

      console.log(mergedConfig['output-metric-labels']);

      const labels: {[x: string]: any}[] = [];
      mergedConfig['output-metric-labels'].forEach((label: string | number) => {
        const obj = {
          [label]: input[label],
        };
        labels.push(obj);
      });

      console.log('labels');
      console.log(labels);

      const metrics: {[x: string]: any}[] = [];
      mergedConfig['output-metrics'].forEach((metric: string | number) => {
        const obj = {
          [metric]: input[metric],
        };
        metrics.push(obj);
      });

      console.log('metrics');
      console.log(metrics);

      metrics.forEach((metric: any) => {
        outputStr += guage(Object.keys(metric)[0], labels, metric);
      });
    });

    //  write file
    fs.writeFile(mergedConfig['output-file'], outputStr, (err: any) => {
      if (err) throw err;
    });

    return inputs.map(input => {
      return input;
    });
  };

  return {
    metadata,
    execute,
  };
};

// A metric is composed by several fields:

// Metric name
// Any number of labels (can be 0), represented as a key-value array
// Current metric value
// Optional metric timestamp

function guage(key: any, labels: any, value: any) {
  // # HELP go_goroutines Number of goroutines that currently exist.
  // # TYPE go_goroutines gauge
  // go_goroutines{method="post",code="400"} 73 1395066363000

  const safeKey = dashify(key);

  const helpStr = `# HELP if-${safeKey} is a gauge\n`;
  const typeStr = `# TYPE if-${safeKey} gauge\n`;

  let labelStr = '{';
  let index = 0;
  labels.forEach((label: any) => {
    if (index > 0) {
      labelStr += ',';
    }
    labelStr +=
      dashify(Object.keys(label)[0]) + `="${label[Object.keys(label)[0]]}"`;
    index += 1;
  });
  labelStr += '}';

  const metricStr = `if-${safeKey}${labelStr} ${value[key]}\n`;

  return helpStr + typeStr + metricStr;
}

function dashify(str: string) {
  return str.replace(/[^\w-]/gi, '-');
}
