"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrometheusExporter = void 0;
const fs = require("node:fs");
const PrometheusExporter = (globalConfig) => {
    const metadata = {
        kind: 'execute',
    };
    /**
     * Execute's strategy description here.
     */
    const execute = async (inputs, config) => {
        const mergedConfig = Object.assign({}, globalConfig, config);
        let outputStr = '';
        inputs.map(input => {
            // console.log('input');
            // console.log(input);
            // console.log(mergedConfig['output-metric-labels']);
            const labels = [];
            mergedConfig['output-metric-labels'].forEach((label) => {
                const obj = {
                    [label]: input[label],
                };
                labels.push(obj);
            });
            // console.log('labels');
            // console.log(labels);
            const metrics = [];
            mergedConfig['output-metrics'].forEach((metric) => {
                const obj = {
                    [metric]: input[metric],
                };
                metrics.push(obj);
            });
            // console.log('metrics');
            // console.log(metrics);
            metrics.forEach((metric) => {
                outputStr += gauge(Object.keys(metric)[0], labels, metric);
            });
        });
        //  write file
        fs.writeFile(mergedConfig['output-file'], outputStr, (err) => {
            if (err)
                throw err;
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
exports.PrometheusExporter = PrometheusExporter;
// A metric is composed by several fields:
// Metric name
// Any number of labels (can be 0), represented as a key-value array
// Current metric value
// Optional metric timestamp
function gauge(key, labels, value) {
    // # HELP go_goroutines Number of goroutines that currently exist.
    // # TYPE go_goroutines gauge
    // go_goroutines{method="post",code="400"} 73 1395066363000
    const safeKey = underscorify(key);
    const helpStr = `# HELP if_${safeKey} is a gauge\n`;
    const typeStr = `# TYPE if_${safeKey} gauge\n`;
    let labelStr = '{';
    let index = 0;
    labels.forEach((label) => {
        if (index > 0) {
            labelStr += ',';
        }
        labelStr +=
            underscorify(Object.keys(label)[0]) +
                `="${label[Object.keys(label)[0]]}"`;
        index += 1;
    });
    labelStr += '}';
    const metricStr = `if_${safeKey}${labelStr} ${value[key]}\n`;
    return helpStr + typeStr + metricStr;
}
// function dashify(str: string) {
//   return str.replace(/[^\w-]/gi, '-');
// }
function underscorify(str) {
    return str.replace(/[^\w_]/gi, '_');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Byb21ldGhldXMtZXhwb3J0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsOEJBQThCO0FBRXZCLE1BQU0sa0JBQWtCLEdBQUcsQ0FDaEMsWUFBMEIsRUFDVCxFQUFFO0lBQ25CLE1BQU0sUUFBUSxHQUFHO1FBQ2YsSUFBSSxFQUFFLFNBQVM7S0FDaEIsQ0FBQztJQUVGOztPQUVHO0lBQ0gsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUNuQixNQUFzQixFQUN0QixNQUFxQixFQUNJLEVBQUU7UUFDM0IsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLHdCQUF3QjtZQUN4QixzQkFBc0I7WUFFdEIscURBQXFEO1lBRXJELE1BQU0sTUFBTSxHQUF5QixFQUFFLENBQUM7WUFDeEMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBc0IsRUFBRSxFQUFFO2dCQUN0RSxNQUFNLEdBQUcsR0FBRztvQkFDVixDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ3RCLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztZQUVILHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFFdkIsTUFBTSxPQUFPLEdBQXlCLEVBQUUsQ0FBQztZQUN6QyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUF1QixFQUFFLEVBQUU7Z0JBQ2pFLE1BQU0sR0FBRyxHQUFHO29CQUNWLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztpQkFDeEIsQ0FBQztnQkFDRixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBRUgsMEJBQTBCO1lBQzFCLHdCQUF3QjtZQUV4QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7Z0JBQzlCLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILGNBQWM7UUFDZCxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUNoRSxJQUFJLEdBQUc7Z0JBQUUsTUFBTSxHQUFHLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLE9BQU87UUFDTCxRQUFRO1FBQ1IsT0FBTztLQUNSLENBQUM7QUFDSixDQUFDLENBQUM7QUFqRVcsUUFBQSxrQkFBa0Isc0JBaUU3QjtBQUVGLDBDQUEwQztBQUUxQyxjQUFjO0FBQ2Qsb0VBQW9FO0FBQ3BFLHVCQUF1QjtBQUN2Qiw0QkFBNEI7QUFFNUIsU0FBUyxLQUFLLENBQUMsR0FBUSxFQUFFLE1BQVcsRUFBRSxLQUFVO0lBQzlDLGtFQUFrRTtJQUNsRSw2QkFBNkI7SUFDN0IsMkRBQTJEO0lBRTNELE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVsQyxNQUFNLE9BQU8sR0FBRyxhQUFhLE9BQU8sZUFBZSxDQUFDO0lBQ3BELE1BQU0sT0FBTyxHQUFHLGFBQWEsT0FBTyxVQUFVLENBQUM7SUFFL0MsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ25CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtRQUM1QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNkLFFBQVEsSUFBSSxHQUFHLENBQUM7UUFDbEIsQ0FBQztRQUNELFFBQVE7WUFDTixZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDdkMsS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxJQUFJLEdBQUcsQ0FBQztJQUVoQixNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFN0QsT0FBTyxPQUFPLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsa0NBQWtDO0FBQ2xDLHlDQUF5QztBQUN6QyxJQUFJO0FBRUosU0FBUyxZQUFZLENBQUMsR0FBVztJQUMvQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmZpZ1BhcmFtc30gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQge1BsdWdpbkludGVyZmFjZSwgUGx1Z2luUGFyYW1zfSBmcm9tICcuLi90eXBlcy9pbnRlcmZhY2UnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnbm9kZTpmcyc7XG5cbmV4cG9ydCBjb25zdCBQcm9tZXRoZXVzRXhwb3J0ZXIgPSAoXG4gIGdsb2JhbENvbmZpZzogQ29uZmlnUGFyYW1zXG4pOiBQbHVnaW5JbnRlcmZhY2UgPT4ge1xuICBjb25zdCBtZXRhZGF0YSA9IHtcbiAgICBraW5kOiAnZXhlY3V0ZScsXG4gIH07XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUncyBzdHJhdGVneSBkZXNjcmlwdGlvbiBoZXJlLlxuICAgKi9cbiAgY29uc3QgZXhlY3V0ZSA9IGFzeW5jIChcbiAgICBpbnB1dHM6IFBsdWdpblBhcmFtc1tdLFxuICAgIGNvbmZpZz86IENvbmZpZ1BhcmFtc1xuICApOiBQcm9taXNlPFBsdWdpblBhcmFtc1tdPiA9PiB7XG4gICAgY29uc3QgbWVyZ2VkQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgZ2xvYmFsQ29uZmlnLCBjb25maWcpO1xuXG4gICAgbGV0IG91dHB1dFN0ciA9ICcnO1xuXG4gICAgaW5wdXRzLm1hcChpbnB1dCA9PiB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnaW5wdXQnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGlucHV0KTtcblxuICAgICAgLy8gY29uc29sZS5sb2cobWVyZ2VkQ29uZmlnWydvdXRwdXQtbWV0cmljLWxhYmVscyddKTtcblxuICAgICAgY29uc3QgbGFiZWxzOiB7W3g6IHN0cmluZ106IGFueX1bXSA9IFtdO1xuICAgICAgbWVyZ2VkQ29uZmlnWydvdXRwdXQtbWV0cmljLWxhYmVscyddLmZvckVhY2goKGxhYmVsOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgIFtsYWJlbF06IGlucHV0W2xhYmVsXSxcbiAgICAgICAgfTtcbiAgICAgICAgbGFiZWxzLnB1c2gob2JqKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnbGFiZWxzJyk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhsYWJlbHMpO1xuXG4gICAgICBjb25zdCBtZXRyaWNzOiB7W3g6IHN0cmluZ106IGFueX1bXSA9IFtdO1xuICAgICAgbWVyZ2VkQ29uZmlnWydvdXRwdXQtbWV0cmljcyddLmZvckVhY2goKG1ldHJpYzogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IHtcbiAgICAgICAgICBbbWV0cmljXTogaW5wdXRbbWV0cmljXSxcbiAgICAgICAgfTtcbiAgICAgICAgbWV0cmljcy5wdXNoKG9iaik7XG4gICAgICB9KTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ21ldHJpY3MnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKG1ldHJpY3MpO1xuXG4gICAgICBtZXRyaWNzLmZvckVhY2goKG1ldHJpYzogYW55KSA9PiB7XG4gICAgICAgIG91dHB1dFN0ciArPSBnYXVnZShPYmplY3Qua2V5cyhtZXRyaWMpWzBdLCBsYWJlbHMsIG1ldHJpYyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vICB3cml0ZSBmaWxlXG4gICAgZnMud3JpdGVGaWxlKG1lcmdlZENvbmZpZ1snb3V0cHV0LWZpbGUnXSwgb3V0cHV0U3RyLCAoZXJyOiBhbnkpID0+IHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbnB1dHMubWFwKGlucHV0ID0+IHtcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG1ldGFkYXRhLFxuICAgIGV4ZWN1dGUsXG4gIH07XG59O1xuXG4vLyBBIG1ldHJpYyBpcyBjb21wb3NlZCBieSBzZXZlcmFsIGZpZWxkczpcblxuLy8gTWV0cmljIG5hbWVcbi8vIEFueSBudW1iZXIgb2YgbGFiZWxzIChjYW4gYmUgMCksIHJlcHJlc2VudGVkIGFzIGEga2V5LXZhbHVlIGFycmF5XG4vLyBDdXJyZW50IG1ldHJpYyB2YWx1ZVxuLy8gT3B0aW9uYWwgbWV0cmljIHRpbWVzdGFtcFxuXG5mdW5jdGlvbiBnYXVnZShrZXk6IGFueSwgbGFiZWxzOiBhbnksIHZhbHVlOiBhbnkpIHtcbiAgLy8gIyBIRUxQIGdvX2dvcm91dGluZXMgTnVtYmVyIG9mIGdvcm91dGluZXMgdGhhdCBjdXJyZW50bHkgZXhpc3QuXG4gIC8vICMgVFlQRSBnb19nb3JvdXRpbmVzIGdhdWdlXG4gIC8vIGdvX2dvcm91dGluZXN7bWV0aG9kPVwicG9zdFwiLGNvZGU9XCI0MDBcIn0gNzMgMTM5NTA2NjM2MzAwMFxuXG4gIGNvbnN0IHNhZmVLZXkgPSB1bmRlcnNjb3JpZnkoa2V5KTtcblxuICBjb25zdCBoZWxwU3RyID0gYCMgSEVMUCBpZl8ke3NhZmVLZXl9IGlzIGEgZ2F1Z2VcXG5gO1xuICBjb25zdCB0eXBlU3RyID0gYCMgVFlQRSBpZl8ke3NhZmVLZXl9IGdhdWdlXFxuYDtcblxuICBsZXQgbGFiZWxTdHIgPSAneyc7XG4gIGxldCBpbmRleCA9IDA7XG4gIGxhYmVscy5mb3JFYWNoKChsYWJlbDogYW55KSA9PiB7XG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgbGFiZWxTdHIgKz0gJywnO1xuICAgIH1cbiAgICBsYWJlbFN0ciArPVxuICAgICAgdW5kZXJzY29yaWZ5KE9iamVjdC5rZXlzKGxhYmVsKVswXSkgK1xuICAgICAgYD1cIiR7bGFiZWxbT2JqZWN0LmtleXMobGFiZWwpWzBdXX1cImA7XG4gICAgaW5kZXggKz0gMTtcbiAgfSk7XG4gIGxhYmVsU3RyICs9ICd9JztcblxuICBjb25zdCBtZXRyaWNTdHIgPSBgaWZfJHtzYWZlS2V5fSR7bGFiZWxTdHJ9ICR7dmFsdWVba2V5XX1cXG5gO1xuXG4gIHJldHVybiBoZWxwU3RyICsgdHlwZVN0ciArIG1ldHJpY1N0cjtcbn1cblxuLy8gZnVuY3Rpb24gZGFzaGlmeShzdHI6IHN0cmluZykge1xuLy8gICByZXR1cm4gc3RyLnJlcGxhY2UoL1teXFx3LV0vZ2ksICctJyk7XG4vLyB9XG5cbmZ1bmN0aW9uIHVuZGVyc2NvcmlmeShzdHI6IHN0cmluZykge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1teXFx3X10vZ2ksICdfJyk7XG59XG4iXX0=