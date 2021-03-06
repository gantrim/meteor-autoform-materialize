import { Template } from 'meteor/templating'
import { AutoForm } from 'meteor/aldeed:autoform'
import './pickadate.html'
import moment from 'moment'

var DATE_FORMAT_PICKER = 'd mmmm yyyy'
var DATE_FORMAT_INPUT = 'D MMMM YYYY'

AutoForm.addInputType('pickadate', {
  template: 'afPickadate',
  valueIn: function(val, atts) {
    return (val instanceof Date)?moment(val).format(DATE_FORMAT_INPUT):val
  },
  valueOut: function() {
    const value = this.val()
    if (value) {
      return moment(value, DATE_FORMAT_INPUT).toDate()
    } else {
      return null
    }
  },
  valueConverters: {
    'string': function(val) {
      if (val instanceof Date) {
        return moment(val, DATE_FORMAT_INPUT).toDate()
      } else {
        return val
      }
    },
    'stringArray': function(val) {
      if (val instanceof Date) {
        return [moment(val, DATE_FORMAT_INPUT).toDate()]
      }
      return val
    },
    'number': function(val) {
      if (val instanceof Date) {
        return moment(val, DATE_FORMAT_INPUT).toDate().getTime()
      } else {
        return val
      }
    },
    'numberArray': function(val) {
      if (val instanceof Date) {
        return [moment(val, DATE_FORMAT_INPUT).toDate().getTime()]
      }
      return val
    },
    'dateArray': function(val) {
      if (val instanceof Date) {
        return [val]
      }
      return val
    }
  },
  contextAdjust: function(context) {
    if (context.atts.timezoneId) {
      context.atts["data-timezone-id"] = context.atts.timezoneId
    }
    delete context.atts.timezoneId
    return context
  }
})

Template.afPickadate.onRendered(() => {
  const instance = Template.instance();
  console.log('pickadate instance.data', instance.data)

  if (instance.data.value) {
    instance.$('input').parent().find('label').addClass('active')
  }

  // init pickadate
  const userOptions = instance.data.atts.pickerOptions || {}
  console.log('pickadate user options', userOptions)
  const options = _.defaults(userOptions, {
    format: DATE_FORMAT_PICKER,
    // hiddenName: true,
    autoClose: true
  })

  // if data min is a date
  if (instance.data.min instanceof Date) {

    // set picker min date
    options.minDate = instance.data.min
  }

  // if data max is a date
  if (instance.data.max instanceof Date) {

    // set picker max date
    options.maxDate = instance.data.max
  }

  // if container is specified
  console.log('options.container', typeof options.container)
  if (typeof options.container === 'string') {

    const q = $(options.container)
    console.log('element', q)
    options.container = q
  }

  console.log('options', options)

  const input = instance.$('input')
  M.Datepicker.init(input, options)
})

Template.afPickadate.helpers({
  atts() {
    const instance = Template.instance()
    const atts = _.clone(instance.data.atts)
    delete atts.pickerOptions
    return atts
  }
})
