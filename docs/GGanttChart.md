# API: GGanttChart
The main component of Vue Ganttastic. Represents an entire chart and is meant to have at least one `g-gantt-row` child component.
## Props
| Prop                | Type                  | Default              | Description                                                                                                                                                                                                                                                                                                                                                                                           |
|---------------------|-----------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `chart-start`       | string                |                      | Start date-time of the chart.                                                                                                                                                                                                                                                                                                                                                                         |
| `chart-end`         | string                |                      | End date-time of the chart.                                                                                                                                                                                                                                                                                                                                                                           |
| `precision`         | string?               | `"hour"`             | Display precision of the time-axis. Possible values: `hour`, `day` and `month`.                                                                                                                                                                                                                                                                                                                       |
| `bar-start`         | string                |                      | Name of the property in bar objects that represents the start date.                                                                                                                                                                                                                                                                                                                                   |
| `bar-end`           | string                |                      | Name of the property in bar objects that represents the end date .                                                                                                                                                                                                                                                                                                                                    |
| `date-format`       | string \| false       | `"YYYY-MM-DD HH:mm"` | Datetime string format of `chart-start`, `chart-end` and the values of the `bar-start`, `bar-end` properties in bar objects. See [Day.js format tokens](https://day.js.org/docs/en/parse/string-format). If the aforementioned properties are native JavaScript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) objects in your use case, pass `false`. |
| `width`             | string?               | `"100%"`             | Width of the chart (e.g. `80%` or `800px`)                                                                                                                                                                                                                                                                                                                                                            |
| `hide-timeaxis`     | boolean?              | `false`              | Toggle visibility of the time axis.                                                                                                                                                                                                                                                                                                                                                                   |
| `color-scheme`      | string \| ColorScheme | `"default"`          | Color scheme (theme) of the chart. Either use the name of one of the predefined schemes or pass a color-scheme-object of your own. See [color schemes](#color-schemes).                                                                                                                                                                                                                               |
| `grid`              | string?               | `false`              | Toggle visibility of background grid.                                                                                                                                                                                                                                                                                                                                                                 |
| `push-on-overlap`   | boolean?              | `false`              | Specifies whether bars "push one another" when dragging and overlaping.                                                                                                                                                                                                                                                                                                                               |
| `no-overlap`        | boolean?              | `false`              | If `push-on-overlap` is `false`, toggle this to prevent overlaps after drag by snapping the dragged bar back to its original position.                                                                                                                                                                                                                                                                |
| `row-height`        | number?               | `40`                 | Height of each row in pixels.                                                                                                                                                                                                                                                                                                                                                                         |
| `highlighted-units` | number[]?             | `[]`                 | The time units specified here will be visually highlighted in the chart with a mild opaque color.                                                                                                                                                                                                                                                                                                     |
| `highlight-sundays` | boolean?              | `false`              | Sundays will be visually highlighted in the chart with a mild opaque color and the dates text color will be changed to a dark red.                                                                                                                                                                                                                                                                    |
| `font`              | `string`              | `"Helvetica"`        | Font family of the chart.                                                                                                                                                                                                                                                                                                                                                                             |

## Custom Events
| Event name                 | Event data                                                 |
|----------------------------|------------------------------------------------------------|
| `click-bar`                |  `{bar: GanttBarObject, e: MouseEvent, datetime?: string}` |
| `mousedown-bar`            |  `{bar: GanttBarObject, e: MouseEvent, datetime?: string}` |
| `mouseup-bar`            |  `{bar: GanttBarObject, e: MouseEvent, datetime?: string}` |
| `dblclick-bar`            |  `{bar: GanttBarObject, e: MouseEvent, datetime?: string}` |
| `mouseenter-bar`            |  `{bar: GanttBarObject, e: MouseEvent}` |
| `mouseleave-bar`            |  `{bar: GanttBarObject, e: MouseEvent}` |
| `dragstart-bar`            |  `{bar: GanttBarObject, e: MouseEvent}` |
| `drag-bar`            |  `{bar: GanttBarObject, e: MouseEvent}` |
| `dragend-bar`            |  `{bar: GanttBarObject, e: MouseEvent, movedBars?: Map<GanttBarObject, {oldStart: string, oldEnd: string}>}` |
| `contextmenu-bar`            |  `{bar: GanttBarObject, e: MouseEvent, datetime?: string}` |
  


## Slots
| Slot name                  | Slot data             | Description                             |
|----------------------------|-----------------------| ----------------------------------------|
| `upper-timeunit`           |  `{label: string, value: string}` | Content of an upper time-unit section in the time axis. |
| `timeunit`           |  `{label: string, value: string}` | Content of a time-unit section in the time axis. |
| `bar-tooltip`        |  `{bar: GanttBarObject}` | Slot for the tooltip which appears when hovering over a bar. |

## Color Schemes  

List of pre-defined color schemes:
- `default`
- `creamy`
- `crimson`
- `dark`
- `flare`
- `fuchsia`
- `grove`
- `material-blue`
- `sky`
- `slumber`
- `vue`

You can also provide your own color scheme. Your custom color scheme should be an object of the following shape:
```javascript
{
  primary: string,
  secondary: string,
  ternary: string,
  quartenary: string,
  hoverHighlight: string,
  text: string,
  background: string,
  toast?: string
}
```