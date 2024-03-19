import {PrometheusExporter} from '../../../lib/prometheus-exporter';

describe('lib/my-custom-plugin: ', () => {
  describe('MyCustomPlugin(): ', () => {
    it('has metadata field.', () => {
      const pluginInstance = PrometheusExporter({});

      expect(pluginInstance).toHaveProperty('metadata');
      expect(pluginInstance).toHaveProperty('execute');
      expect(pluginInstance.metadata).toHaveProperty('kind');
      expect(typeof pluginInstance.execute).toBe('function');
    });

    describe('execute(): ', () => {
      it('applies logic on provided inputs array.', async () => {
        const pluginInstance = PrometheusExporter({
          'output-file': 'metrics.prom',
          'output-metrics': [
            'k8s/cpu/utilization',
            'cpu/utilization',
            'k8s/memory/utilization',
            'memory/utilization',
            'cpu/energy',
            'memory/energy',
            'carbon-embodied',
            'energy',
            'carbon-operational',
            'carbon',
            'sci',
          ],
          'output-metric-labels': [
            'k8s/node/name',
            'k8s/pod/name',
            'k8s/container/name',
            'k8s/namespace',
            'k8s/label/k8s-app',
          ],
        });
        const inputs = [{}];

        const response = await pluginInstance.execute(inputs, [
          {
            'k8s/node/name': 'docker-desktop',
            'k8s/pod/name': 'storage-provisioner',
            'k8s/container/name': 'storage-provisioner',
            'k8s/namespace': 'kube-system',
            timestamp: '2024-03-19T13:15:14Z',
            duration: 15,
            'k8s/cpu/utilization': '2948472',
            'cpu/utilization': 0.000737118,
            'k8s/memory/utilization': '17888',
            'memory/utilization': 0.002946012606193478,
            'memory/capacity': 6071936,
            'device/emissions-embodied': 1533.12,
            'time-reserved': 15,
            'device/expected-lifespan': 94608000,
            'resources-reserved': 1,
            'resources-total': 1,
            'grid/carbon-intensity': 800,
            'cpu/thermal-design-power': 30,
            'cpu/energy': 0.000015001924316205197,
            'memory/energy': 0.07012096000000001,
            'carbon-embodied': 0.0002430745814307458,
            energy: 0.07013596192431622,
            'carbon-operational': 56.10876953945297,
            carbon: 3.740600840935627,
            sci: 3.740600840935627,
          },
          {
            'k8s/node/name': 'docker-desktop',
            'k8s/pod/name': 'vpnkit-controller',
            'k8s/container/name': 'vpnkit-controller',
            'k8s/namespace': 'kube-system',
            timestamp: '2024-03-19T13:15:14Z',
            duration: 15,
            'k8s/cpu/utilization': '0',
            'cpu/utilization': 0,
            'k8s/memory/utilization': '37900',
            'memory/utilization': 0.006241831270948838,
            'memory/capacity': 6071936,
            'device/emissions-embodied': 1533.12,
            'time-reserved': 15,
            'device/expected-lifespan': 94608000,
            'resources-reserved': 1,
            'resources-total': 1,
            'grid/carbon-intensity': 800,
            'cpu/thermal-design-power': 30,
            'cpu/energy': 0.000014999999999999997,
            'memory/energy': 0.148568,
            'carbon-embodied': 0.0002430745814307458,
            energy: 0.148583,
            'carbon-operational': 118.8664,
            carbon: 7.924442871638762,
            sci: 7.924442871638762,
          },
        ]);
        expect(response).toEqual(inputs);
      });
    });
  });
});
