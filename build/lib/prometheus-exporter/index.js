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
            dashify(Object.keys(label)[0].toString()) +
                `="` +
                dashify(label[Object.keys(label)[0].toString()]) +
                `"`;
        index += 1;
    });
    labelStr += '}';
    const metricStr = `if_${safeKey}${labelStr} ${value[key]}\n`;
    return helpStr + typeStr + metricStr;
}
function dashify(str) {
    return str.replace(/[^\w-]/gi, '-');
}
function underscorify(str) {
    return str.replace(/[^\w_]/gi, '_');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3Byb21ldGhldXMtZXhwb3J0ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsOEJBQThCO0FBRXZCLE1BQU0sa0JBQWtCLEdBQUcsQ0FDaEMsWUFBMEIsRUFDVCxFQUFFO0lBQ25CLE1BQU0sUUFBUSxHQUFHO1FBQ2YsSUFBSSxFQUFFLFNBQVM7S0FDaEIsQ0FBQztJQUVGOztPQUVHO0lBQ0gsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUNuQixNQUFzQixFQUN0QixNQUFxQixFQUNJLEVBQUU7UUFDM0IsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUVuQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pCLHdCQUF3QjtZQUN4QixzQkFBc0I7WUFFdEIscURBQXFEO1lBRXJELE1BQU0sTUFBTSxHQUF5QixFQUFFLENBQUM7WUFDeEMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBc0IsRUFBRSxFQUFFO2dCQUN0RSxNQUFNLEdBQUcsR0FBRztvQkFDVixDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7aUJBQ3RCLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDLENBQUMsQ0FBQztZQUVILHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFFdkIsTUFBTSxPQUFPLEdBQXlCLEVBQUUsQ0FBQztZQUN6QyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUF1QixFQUFFLEVBQUU7Z0JBQ2pFLE1BQU0sR0FBRyxHQUFHO29CQUNWLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQztpQkFDeEIsQ0FBQztnQkFDRixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1lBRUgsMEJBQTBCO1lBQzFCLHdCQUF3QjtZQUV4QixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7Z0JBQzlCLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILGNBQWM7UUFDZCxFQUFFLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUNoRSxJQUFJLEdBQUc7Z0JBQUUsTUFBTSxHQUFHLENBQUM7UUFDckIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTyxLQUFLLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLE9BQU87UUFDTCxRQUFRO1FBQ1IsT0FBTztLQUNSLENBQUM7QUFDSixDQUFDLENBQUM7QUFqRVcsUUFBQSxrQkFBa0Isc0JBaUU3QjtBQUVGLDBDQUEwQztBQUUxQyxjQUFjO0FBQ2Qsb0VBQW9FO0FBQ3BFLHVCQUF1QjtBQUN2Qiw0QkFBNEI7QUFFNUIsU0FBUyxLQUFLLENBQUMsR0FBUSxFQUFFLE1BQVcsRUFBRSxLQUFVO0lBQzlDLGtFQUFrRTtJQUNsRSw2QkFBNkI7SUFDN0IsMkRBQTJEO0lBRTNELE1BQU0sT0FBTyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVsQyxNQUFNLE9BQU8sR0FBRyxhQUFhLE9BQU8sZUFBZSxDQUFDO0lBQ3BELE1BQU0sT0FBTyxHQUFHLGFBQWEsT0FBTyxVQUFVLENBQUM7SUFFL0MsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ25CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRTtRQUM1QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNkLFFBQVEsSUFBSSxHQUFHLENBQUM7UUFDbEIsQ0FBQztRQUNELFFBQVE7WUFDTixPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDekMsSUFBSTtnQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztnQkFDaEQsR0FBRyxDQUFDO1FBQ04sS0FBSyxJQUFJLENBQUMsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxJQUFJLEdBQUcsQ0FBQztJQUVoQixNQUFNLFNBQVMsR0FBRyxNQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFN0QsT0FBTyxPQUFPLEdBQUcsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN2QyxDQUFDO0FBRUQsU0FBUyxPQUFPLENBQUMsR0FBVztJQUMxQixPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxHQUFXO0lBQy9CLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnUGFyYW1zfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7UGx1Z2luSW50ZXJmYWNlLCBQbHVnaW5QYXJhbXN9IGZyb20gJy4uL3R5cGVzL2ludGVyZmFjZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdub2RlOmZzJztcblxuZXhwb3J0IGNvbnN0IFByb21ldGhldXNFeHBvcnRlciA9IChcbiAgZ2xvYmFsQ29uZmlnOiBDb25maWdQYXJhbXNcbik6IFBsdWdpbkludGVyZmFjZSA9PiB7XG4gIGNvbnN0IG1ldGFkYXRhID0ge1xuICAgIGtpbmQ6ICdleGVjdXRlJyxcbiAgfTtcblxuICAvKipcbiAgICogRXhlY3V0ZSdzIHN0cmF0ZWd5IGRlc2NyaXB0aW9uIGhlcmUuXG4gICAqL1xuICBjb25zdCBleGVjdXRlID0gYXN5bmMgKFxuICAgIGlucHV0czogUGx1Z2luUGFyYW1zW10sXG4gICAgY29uZmlnPzogQ29uZmlnUGFyYW1zXG4gICk6IFByb21pc2U8UGx1Z2luUGFyYW1zW10+ID0+IHtcbiAgICBjb25zdCBtZXJnZWRDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBnbG9iYWxDb25maWcsIGNvbmZpZyk7XG5cbiAgICBsZXQgb3V0cHV0U3RyID0gJyc7XG5cbiAgICBpbnB1dHMubWFwKGlucHV0ID0+IHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdpbnB1dCcpO1xuICAgICAgLy8gY29uc29sZS5sb2coaW5wdXQpO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZyhtZXJnZWRDb25maWdbJ291dHB1dC1tZXRyaWMtbGFiZWxzJ10pO1xuXG4gICAgICBjb25zdCBsYWJlbHM6IHtbeDogc3RyaW5nXTogYW55fVtdID0gW107XG4gICAgICBtZXJnZWRDb25maWdbJ291dHB1dC1tZXRyaWMtbGFiZWxzJ10uZm9yRWFjaCgobGFiZWw6IHN0cmluZyB8IG51bWJlcikgPT4ge1xuICAgICAgICBjb25zdCBvYmogPSB7XG4gICAgICAgICAgW2xhYmVsXTogaW5wdXRbbGFiZWxdLFxuICAgICAgICB9O1xuICAgICAgICBsYWJlbHMucHVzaChvYmopO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdsYWJlbHMnKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGxhYmVscyk7XG5cbiAgICAgIGNvbnN0IG1ldHJpY3M6IHtbeDogc3RyaW5nXTogYW55fVtdID0gW107XG4gICAgICBtZXJnZWRDb25maWdbJ291dHB1dC1tZXRyaWNzJ10uZm9yRWFjaCgobWV0cmljOiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICAgICAgY29uc3Qgb2JqID0ge1xuICAgICAgICAgIFttZXRyaWNdOiBpbnB1dFttZXRyaWNdLFxuICAgICAgICB9O1xuICAgICAgICBtZXRyaWNzLnB1c2gob2JqKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnbWV0cmljcycpO1xuICAgICAgLy8gY29uc29sZS5sb2cobWV0cmljcyk7XG5cbiAgICAgIG1ldHJpY3MuZm9yRWFjaCgobWV0cmljOiBhbnkpID0+IHtcbiAgICAgICAgb3V0cHV0U3RyICs9IGdhdWdlKE9iamVjdC5rZXlzKG1ldHJpYylbMF0sIGxhYmVscywgbWV0cmljKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gIHdyaXRlIGZpbGVcbiAgICBmcy53cml0ZUZpbGUobWVyZ2VkQ29uZmlnWydvdXRwdXQtZmlsZSddLCBvdXRwdXRTdHIsIChlcnI6IGFueSkgPT4ge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlucHV0cy5tYXAoaW5wdXQgPT4ge1xuICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbWV0YWRhdGEsXG4gICAgZXhlY3V0ZSxcbiAgfTtcbn07XG5cbi8vIEEgbWV0cmljIGlzIGNvbXBvc2VkIGJ5IHNldmVyYWwgZmllbGRzOlxuXG4vLyBNZXRyaWMgbmFtZVxuLy8gQW55IG51bWJlciBvZiBsYWJlbHMgKGNhbiBiZSAwKSwgcmVwcmVzZW50ZWQgYXMgYSBrZXktdmFsdWUgYXJyYXlcbi8vIEN1cnJlbnQgbWV0cmljIHZhbHVlXG4vLyBPcHRpb25hbCBtZXRyaWMgdGltZXN0YW1wXG5cbmZ1bmN0aW9uIGdhdWdlKGtleTogYW55LCBsYWJlbHM6IGFueSwgdmFsdWU6IGFueSkge1xuICAvLyAjIEhFTFAgZ29fZ29yb3V0aW5lcyBOdW1iZXIgb2YgZ29yb3V0aW5lcyB0aGF0IGN1cnJlbnRseSBleGlzdC5cbiAgLy8gIyBUWVBFIGdvX2dvcm91dGluZXMgZ2F1Z2VcbiAgLy8gZ29fZ29yb3V0aW5lc3ttZXRob2Q9XCJwb3N0XCIsY29kZT1cIjQwMFwifSA3MyAxMzk1MDY2MzYzMDAwXG5cbiAgY29uc3Qgc2FmZUtleSA9IHVuZGVyc2NvcmlmeShrZXkpO1xuXG4gIGNvbnN0IGhlbHBTdHIgPSBgIyBIRUxQIGlmXyR7c2FmZUtleX0gaXMgYSBnYXVnZVxcbmA7XG4gIGNvbnN0IHR5cGVTdHIgPSBgIyBUWVBFIGlmXyR7c2FmZUtleX0gZ2F1Z2VcXG5gO1xuXG4gIGxldCBsYWJlbFN0ciA9ICd7JztcbiAgbGV0IGluZGV4ID0gMDtcbiAgbGFiZWxzLmZvckVhY2goKGxhYmVsOiBhbnkpID0+IHtcbiAgICBpZiAoaW5kZXggPiAwKSB7XG4gICAgICBsYWJlbFN0ciArPSAnLCc7XG4gICAgfVxuICAgIGxhYmVsU3RyICs9XG4gICAgICBkYXNoaWZ5KE9iamVjdC5rZXlzKGxhYmVsKVswXS50b1N0cmluZygpKSArXG4gICAgICBgPVwiYCArXG4gICAgICBkYXNoaWZ5KGxhYmVsW09iamVjdC5rZXlzKGxhYmVsKVswXS50b1N0cmluZygpXSkgK1xuICAgICAgYFwiYDtcbiAgICBpbmRleCArPSAxO1xuICB9KTtcbiAgbGFiZWxTdHIgKz0gJ30nO1xuXG4gIGNvbnN0IG1ldHJpY1N0ciA9IGBpZl8ke3NhZmVLZXl9JHtsYWJlbFN0cn0gJHt2YWx1ZVtrZXldfVxcbmA7XG5cbiAgcmV0dXJuIGhlbHBTdHIgKyB0eXBlU3RyICsgbWV0cmljU3RyO1xufVxuXG5mdW5jdGlvbiBkYXNoaWZ5KHN0cjogc3RyaW5nKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvW15cXHctXS9naSwgJy0nKTtcbn1cblxuZnVuY3Rpb24gdW5kZXJzY29yaWZ5KHN0cjogc3RyaW5nKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvW15cXHdfXS9naSwgJ18nKTtcbn1cbiJdfQ==