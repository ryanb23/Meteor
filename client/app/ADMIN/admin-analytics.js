import { Students }   from '../../../both/collections/api/students.js';
import { Courses }   from '../../../both/collections/api/courses.js';
import { ReactiveVar } from 'meteor/reactive-var';

Tracker.autorun(() => {
  Meteor.subscribe('students');
  Meteor.subscribe('courses');
});

const rangeStart = new ReactiveVar(moment().subtract(1, 'months').toDate());
const rangeEnd = new ReactiveVar(new Date());
const scriptsLoaded = new ReactiveVar(false);
// ReactiveVar.set('rangeStart', moment().subtract(1, 'months').toDate());
// ReactiveVar.set('rangeEnd', new Date());

Template.analytics.onRendered(() => {
  const urls = [
    'https://www.amcharts.com/lib/3/amcharts.js',
    'https://www.amcharts.com/lib/3/pie.js',
    'https://www.amcharts.com/lib/3/serial.js',
    'https://www.amcharts.com/lib/3/plugins/export/export.min.js',
    'https://www.amcharts.com/lib/3/plugins/tools/smoothCustomBullets/smoothCustomBullets.min.js',
    'https://www.amcharts.com/lib/3/themes/light.js',
    'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
  ];
  getScript(urls, 0, () => scriptsLoaded.set(true));
  const datepicker = $('#datepicker').daterangepicker({
    datepickerOptions: {
      numberOfMonths: 1,
    },
    change() {
      const { start, end } = datepicker.daterangepicker('getRange');
      rangeStart.set(start);
      rangeEnd.set(end);
    },
  });
  datepicker.daterangepicker('setRange', {
    start: rangeStart.get(),
    end: rangeEnd.get(),
  });
});

Template.analytics.helpers({
  tableSettings() {
    return {
      collection: Students.find({}),
      rowsPerPage: 10,
      showFilter: true,
      fields: [
        { key: 'fullName',
          label: 'Student Name',
          tmpl: Template.analyticsTableNameCell,
        },
        {
          key: 'current_credits',
          label: 'Credits Remaining',
          cellClass: 'text-center',
        },
        {
          key: 'certifications.0',
          label: 'Certificate #1',
          fn: val => formatDate(val),
          cellClass: 'text-center',
        },
        {
          key: 'certifications.1',
          label: 'Certificate #2',
          fn: val => formatDate(val),
          cellClass: 'text-center',
        },
        {
          key: 'certifications.2',
          label: 'Certificate #3',
          fn: val => formatDate(val),
          cellClass: 'text-center',
        },
      ],
    };
  },
  renderCharts() {
    if (scriptsLoaded.get()) {
      renderCharts();
    }
  },
});

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function shuffle(array) {
  let counter = array.length;
    // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function formatDate(date) {
  let timestamp;
  if (date instanceof Date) {
    timestamp = date.getTime();
  } else if(typeof date === 'number') {
    timestamp = date;
  } else {
    return '';
  }
  return moment(timestamp).format('M/D/YYYY');
}

function getScript(urls, index = 0, ck = () => {}) {
  const url = urls[index];
  if (url) {
    return $.getScript(url, () => getScript(urls, index + 1, ck));
  }
  return ck();
}

function renderCharts() {
  renderCourseChart();
  renderPerformersChart();
  renderOverdueChart();
  renderCompletedCreditsChart();
}

function renderCourseChart() {
  const MAX_COURSES = 6;
  const courses = Courses.find({}, {
    limit: MAX_COURSES,
    sort: { times_completed: -1 },
  }).fetch();
  if(courses.length && courses.length > 1) {
    AmCharts.makeChart('courseChart', {
      'theme': 'light',
      'type': 'serial',
      'dataProvider': shuffle(courses).map(({ name, times_completed }) => ({
        course: name,
        completed: times_completed,
      })),
      'graphs': [{
        'balloonText': '"[[category]]" course was completed [[value]] times',
        'fillAlphas': 1,
        'lineAlpha': 0.2,
        'title': 'Completed',
        'type': 'column',
        'valueField': 'completed',
      }],
      'depth3D': 5,
      'angle': 22,
      'rotate': true,
      'categoryField': 'course',
      'categoryAxis': {
        'gridPosition': 'start',
        'fillAlpha': 0.05,
        'position': 'left',
      },
    });
  }
}

function renderPerformersChart() {
  const MAX_PERFORMERS = 5;
  const performers = Students.find({}, {
    limit: MAX_PERFORMERS,
    sort: {
      current_credits: -1,
    },
  }).fetch();
  AmCharts.makeChart('performersChart', {
    'type': 'serial',
    'theme': 'light',
    'dataProvider': shuffle(performers).map(({ fullName, current_credits, avatar }) => ({
      name: fullName,
      credits: current_credits,
      avatar,
      color: getRandomColor(),
    })),
    'startDuration': 1,
    'graphs': [{
      'balloonText': '<span style="border-radius:50%; font-size:13px;">[[category]]: <b>[[value]]</b></span>',
      'bulletOffset': 10,
      'bulletSize': 52,
      'colorField': 'color',
      'cornerRadiusTop': 2,
      'customBulletField': 'avatar',
      'fillAlphas': 0.8,
      'lineAlpha': 0,
      'type': 'column',
      'valueField': 'credits',
    }],
    'smoothCustomBullets': {
      'borderRadius': 'auto',
    },
    'marginTop': 0,
    'marginRight': 0,
    'marginLeft': 0,
    'marginBottom': 0,
    'autoMargins': false,
    'categoryField': 'name',
    'categoryAxis': {
      'axisAlpha': 0,
      'gridAlpha': 0,
      'inside': true,
      'tickLength': 0,
    },
  });
}

function renderOverdueChart() {
  const overdueCount = Students.find({
    '$where': 'this.required_credits > this.current_credits',
  }).count();
  const upToDateCount = Students.find({}).count() - overdueCount;
  AmCharts.makeChart('overdueChart', {
    'type': 'pie',
    'theme': 'light',
    'innerRadius': '40%',
    'gradientRatio': [-0.4, -0.4, -0.4, -0.4, -0.4, -0.4, 0, 0.1, 0.2, 0.1, 0, -0.2, -0.5],
    'dataProvider': [{
      'state': 'Up to Date',
      'number': upToDateCount,
    }, {
      'state': 'Overdue',
      'number': overdueCount,
    }],
    'balloonText': '[[value]]',
    'valueField': 'number',
    'titleField': 'state',
    'balloon': {
      'drop': true,
      'adjustBorderColor': false,
      'color': '#FFFFFF',
      'fontSize': 1,
    },
  });
}

function renderCompletedCreditsChart() {
  const start = moment(rangeStart.get());
  const end = moment(rangeEnd.get());
  const dataProvider = [];
  const dateFormat = 'YYYY-MM-DD';
  while(start.diff(end, 'days') < 1) {
    const startOfDay = start.startOf('day').toDate();
    const endOfDay = start.endOf('day').toDate();
    const students = Students.find({
      'courses_completed.date_completed': {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).fetch();
    let overallCredits = 0;
    students.forEach(student => {
      overallCredits += student.courses_completed.reduce((credits, course) => {
        if (course.date_completed >= startOfDay && course.date_completed <= endOfDay ) {
          return credits + course.credits;
        }
        return credits;
      }, 0);
    });
    dataProvider.push({
      date: start.format(dateFormat),
      value: overallCredits,
    });
    start.add(1, 'days');
  }
  const chart = AmCharts.makeChart('completedCreditsChart', {
    'type': 'serial',
    'theme': 'light',
    'marginRight': 40,
    'marginLeft': 40,
    'autoMarginOffset': 20,
    'mouseWheelZoomEnabled': true,
    'dataDateFormat': dateFormat,
    'valueAxes': [{
      'id': 'v1',
      'axisAlpha': 0,
      'position': 'left',
      'ignoreAxisWidth': true,
    }],
    'balloon': {
      'borderThickness': 1,
      'shadowAlpha': 0,
    },
    'graphs': [{
      'id': 'g1',
      'balloon': {
        'drop': true,
        'adjustBorderColor': false,
        'color': '#ffffff',
      },
      'bullet': 'round',
      'bulletBorderAlpha': 1,
      'bulletColor': '#FFFFFF',
      'bulletSize': 5,
      'hideBulletsCount': 50,
      'lineThickness': 2,
      'title': 'red line',
      'useLineColorForBulletBorder': true,
      'valueField': 'value',
      'balloonText': '<span style="font-size:18px;">[[value]]</span>',
    }],
    'chartScrollbar': {
      'graph': 'g1',
      'oppositeAxis': false,
      'offset': 30,
      'scrollbarHeight': 80,
      'backgroundAlpha': 0,
      'selectedBackgroundAlpha': 0.1,
      'selectedBackgroundColor': '#888888',
      'graphFillAlpha': 0,
      'graphLineAlpha': 0.5,
      'selectedGraphFillAlpha': 0,
      'selectedGraphLineAlpha': 1,
      'autoGridCount': true,
      'color': '#AAAAAA',
    },
    'chartCursor': {
      'pan': true,
      'valueLineEnabled': true,
      'valueLineBalloonEnabled': true,
      'cursorAlpha': 1,
      'cursorColor': '#258cbb',
      'limitToGraph': 'g1',
      'valueLineAlpha': 0.2,
      'valueZoomable': true,
    },
    'categoryField': 'date',
    'categoryAxis': {
      'parseDates': true,
      'dashLength': 1,
      'minorGridEnabled': true,
    },
    'export': {
      'enabled': true,
    },
    'dataProvider': dataProvider,
  });

  chart.addListener('rendered', zoomChart);
  zoomChart();

  function zoomChart() {
    const { length } = chart.dataProvider;
    chart.zoomToIndexes(length - 40, length - 1);
  }
}
