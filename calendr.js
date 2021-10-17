import moment from "moment";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default ({
  year = new Date().getFullYear(),
  month = new Date().getMonth(),
  periods = [],
  style = {},
  weekdayHeadingsStyles = {},
  weekdayHeadingStyles = {},
  weekdayHeadingTextStyles = {},
  daysOfMonthStyles = {},
  dayOfMonthStyles = {},
  dayOfMonthTextStyles = {},
  dayOfMonthTextTodayStyles = {},
  dayOfMonthColourStyles = {},
  dayOfMonthColourJoinsLeftStyles = {},
  dayOfMonthColourJoinsRightStyles = {}
}) => {
  const [calendarWidth, setCalendarWidth] = useState(0);

  const dayOfWeekWidth = 0.141;
  const dayOfWeekColourMargin = 0.15;

  const daysOfMonth = {};

  for (let day = 1; day <= moment({ year, month }).endOf("month").date(); day++) {
    const date = moment({ year, month, day});
    const dateKey = `date-${date.format("YYYY-MM-DD")}`;
    daysOfMonth[dateKey] = {
      group: null,
      colour: null
    };
  }

  periods.forEach((period, index) => {
    for (let i = period.start.getTime(); i <= period.end.getTime(); i += 86400000) {
      const date = new Date(i);
      const dateKey = `date-${moment(date).format("YYYY-MM-DD")}`;
      if (daysOfMonth.hasOwnProperty(dateKey)) {
        daysOfMonth[dateKey].group = index;
        daysOfMonth[dateKey].colour = period.colour;
      }
    }
  });

  const styles = StyleSheet.create({
    calendar: {
      ...style
    },

    calendarWeekdayHeadings: {
      flexDirection: "row",
      justifyContent: "center",
      ...weekdayHeadingsStyles
    },
    calendarWeekdayHeading: {
      width: calendarWidth * dayOfWeekWidth,
      height: (calendarWidth * dayOfWeekWidth) * 0.75,
      alignItems: "center",
      justifyContent: "center",
      ...weekdayHeadingStyles
    },
    calendarWeekdayHeadingText: {
      fontSize: (calendarWidth * dayOfWeekWidth) * 0.275,
      ...weekdayHeadingTextStyles
    },

    calendarDaysOfMonth: {
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
      ...daysOfMonthStyles
    },

    calendarDayOfMonth: {
      width: calendarWidth * dayOfWeekWidth,
      height: calendarWidth * dayOfWeekWidth,
      alignItems: "center",
      justifyContent: "center",
      ...dayOfMonthStyles
    },

    calendarDayOfMonthText: {
      fontSize: (calendarWidth * dayOfWeekWidth) * 0.275,
      ...dayOfMonthTextStyles
    },
    calendarDayOfMonthTextToday: {
      fontSize: (calendarWidth * dayOfWeekWidth) * 0.3,
      fontWeight: "bold",
      ...dayOfMonthTextTodayStyles
    },

    calendarDayOfMonthColour: {
      position: "absolute",
      left: (calendarWidth * dayOfWeekWidth) * dayOfWeekColourMargin,
      right: (calendarWidth * dayOfWeekWidth) * dayOfWeekColourMargin,
      top: (calendarWidth * dayOfWeekWidth) * dayOfWeekColourMargin,
      bottom: (calendarWidth * dayOfWeekWidth) * dayOfWeekColourMargin,
      borderRadius: (calendarWidth * dayOfWeekWidth) * ((1 - (dayOfWeekColourMargin * 2)) / 2),
      ...dayOfMonthColourStyles
    },
    calendarDayOfMonthColourJoinsLeft: {
      left: -1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      ...dayOfMonthColourJoinsLeftStyles
    },
    calendarDayOfMonthColourJoinsRight: {
      right: -1,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      ...dayOfMonthColourJoinsRightStyles
    }
  });

  const WeekdayHeading = ({ index = 0 }) => {
    return (
      <View key={`weekdayHeading-${index}`} style={styles.calendarWeekdayHeading}>
        <Text style={styles.calendarWeekdayHeadingText}>{moment().isoWeekday(index + 1).format("ddd")}</Text>
      </View>
    );
  };

  const DayOfMonth = ({ day = 1, joinsLeft = false, joinsRight = false, colour = "transparent" }) => {
    return (<View key={`dayOfMonth-${day}`} style={styles.calendarDayOfMonth}>
      <View style={{...styles.calendarDayOfMonthColour, backgroundColor: colour, ...(joinsLeft ? styles.calendarDayOfMonthColourJoinsLeft : {}), ...(joinsRight ? styles.calendarDayOfMonthColourJoinsRight : {})}} />
      <Text style={{...styles.calendarDayOfMonthText, ...(moment({ year, month }).date(day).isSame(moment(), "day") ? styles.calendarDayOfMonthTextToday : {})}}>{day}</Text>
    </View>);
  };

  return (
    <View style={styles.calendar} onLayout={(e) => setCalendarWidth(e.nativeEvent.layout.width)}>
      <View style={styles.calendarWeekdayHeadings}>
        {[...Array(7).keys()].map((i) => (
          <WeekdayHeading key={`weekdayHeading-${i}`} index={i} />
        ))}
      </View>
      <View style={styles.calendarDaysOfMonth}>
        {moment({ year, month }).isoWeekday() > 0 && [...Array(moment({ year, month }).isoWeekday() - 1).keys()].map((i) => (
          <View key={`dayOfMonthSpacer-${i}`} style={{...styles.calendarDayOfMonth}} />
        ))}
        {[...Array(moment({ year, month }).endOf("month").date()).keys()].map((i) => (
          <DayOfMonth key={`dayOfMonth-${i}`} day={i + 1}
            joinsLeft={daysOfMonth[`date-${moment({ year, month, day: (i + 1) - 1 }).format("YYYY-MM-DD")}`]?.group == daysOfMonth[`date-${moment({ year, month, day: (i + 1) }).format("YYYY-MM-DD")}`]?.group}
            joinsRight={daysOfMonth[`date-${moment({ year, month, day: (i + 1) }).format("YYYY-MM-DD")}`]?.group == daysOfMonth[`date-${moment({ year, month, day: (i + 1) + 1 }).format("YYYY-MM-DD")}`]?.group}
            colour={daysOfMonth[`date-${moment({ year, month, day: i + 1 }).format("YYYY-MM-DD")}`].colour} />
        ))}
        {moment({ year, month }).endOf("month").isoWeekday() < 7 && [...Array(7 - moment({ year, month }).endOf("month").isoWeekday()).keys()].map((i) => (
          <View key={`dayOfMonthSpacer-${i}`} style={{...styles.calendarDayOfMonth}} />
        ))}
      </View>
    </View>
  );
};
