const scss = `
.app-bg-icon-select {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 3px;
  box-shadow: none;
  font-size: 14px;
  height: 2.25em;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  background-color: #fff;
  border-color: #d5dee7;
  color: #324558;
  box-shadow: none;
  border-radius: 2px 8px 8px 8px;
}

.app-icon-select-option-box {
  display: flex;
  flex-wrap: wrap;
  max-width: 363px;
  gap: 5px;
  padding: 16px;
  background: #FFFFFF;
  box-shadow: 0px 8px 24px rgba(153, 181, 221, 0.25);
  border-radius: 12px;
}

.app-icon-select-option {
  cursor: pointer;
  color: #B6C2CD;
  &:hover,&.app-icon-select-active {
    color: #475569;
  }
}

@layer components {
  .qxp-breadcrumb {
    @apply flex text-14 select-none items-stretch font-normal leading-24 text-left tracking-normal overflow-hidden whitespace-nowrap;
    color: #94A3B8;

    ul {
      @apply flex items-center flex-1 justify-start;
    }

    .svg-icon {
      @apply m-0;
    }

    .qxp-breadcrumb-item {
      @apply inline-flex items-center justify-center p-0;

      a {
        color: #94A3B8;

        &:hover {
          @apply underline;
          color: #475569;
        }

        &:active {
          @apply underline;
          color: #0F172A;
        }
      }

      .icon {
        @apply m-0;
      }

      &:before {
        @apply hidden;
      }

      .qxp-breadcrumb-link {
        @apply inline-flex items-center justify-center p-0;
      }

      .qxp-breadcrumb-separator {
        @apply px-8 py-0;
        color: #94A3B8;

        .icon {
          @apply m-0;
        }
      }
    }

    .qxp-breadcrumb-item:last-child {
      color: #0F172A;

      .qxp-breadcrumb-separator {
        @apply hidden;
      }
    }
  }
}

$calendar-background-color: #ffffff;
$calendar-selected-background: #f5f7fa;
$calendar-border: 1px solid #e4ebf1;
$calendar-border-radius: 3px;
$calendar-text-color: #324558;
$calendar-active-text-color: #04969b;
$calendar-disabled-text-color: #a1abb5;

@include block(calendar) {
}

@include block(calendar-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  border-bottom: $calendar-border;

  @include element(shift) {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: $calendar-border-radius;
    cursor: pointer;

    &:hover {
      background-color: $calendar-selected-background;
    }
  }

  @include element(date) {
    position: relative;
    overflow: visible;
  }

  @include element(label) {
    display: block;
    padding: 0 8px;
    border-radius: $calendar-border-radius;
    line-height: 32px;
    cursor: pointer;

    &::after {
      display: inline-flex;
      width: 0;
      height: 0;
      border: 4px solid transparent;
      border-top-color: #697886;
      margin: 2px 0 0 8px;
      vertical-align: middle;
      transform-origin: 50% 25%;
      content: "";
    }

    &:hover {
      background-color: $calendar-selected-background;
    }

    &.is-open {
      background-color: $calendar-selected-background;

      &::after {
        transform: rotate(180deg);
      }
    }
  }

  @include element(dropdown) {
    position: absolute;
    top: 100%;
    left: 50%;
    display: flex;
    width: 80px;
    border: $calendar-border;
    border-radius: $calendar-border-radius;
    margin: -4px 0 0 -40px;
    background-color: #ffffff;
    box-shadow: $box-shadow;
    opacity: 0;
    visibility: hidden;
    transition: all .2s ease;

    @include modifier(wide) {
      width: 148px;
      margin-left: -74px;
    }

    &:first-child {
      border-right: $calendar-border;
    }

    &.is-active {
      margin-top: 0;
      opacity: 1;
      visibility: visible;
    }
  }

  @include element(menu) {
    flex: 1 1 64px;
    max-height: 240px;
    overflow-y: scroll;
    transition: all .2s ease;

    li {
      line-height: 32px;
      text-align: center;
      cursor: pointer;

      &.is-outside-range {
        color: $calendar-disabled-text-color;
        cursor: not-allowed;
      }

      &.is-active {
        font-weight: 500;
        color: $calendar-active-text-color;
      }

      &:hover {
        background-color: #f5f7fa;
      }
    }

    &:hover {
      flex-basis: 80px;
    }

    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: $border-radius;
      background-color: #c6d1dc;
    }
  }
}


@include block(calendar-month) {
  padding: 0 12px;

  @include element(header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;

    span {
      width: 32px;
      font-size: 90%;
      color: #86919c;
      text-align: center;
    }
  }

  @include element(week) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 280px;
    height: 40px;
  }

  @include element(week-picker) {
    border-radius: $calendar-border-radius;
    cursor: pointer;

    .calendar-month__single-day {
      cursor: pointer;
    }

    &:hover {
      background-color: $calendar-selected-background;
    }
  }

  @include element(selected-week) {
    background-color: #04969b;

    &:hover {
      background-color: #04969b;
    }
  }

  @include element(outside-range-week) {
    cursor: not-allowed;

    .calendar-month__single-day {
      cursor: not-allowed;
    }
  }

  @include element(week-index) {
    width: 32px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-right: $calendar-border;
    color: $calendar-disabled-text-color;
  }

  @include element(single-day) {
    width: 32px;
    max-width: 32px;
    height: 32px;
    border-radius: $calendar-border-radius;
    line-height: 32px;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: $calendar-selected-background;
    }
  }

  @include element(outside-month-day) {
    color: $calendar-disabled-text-color;
  }

  @include element(outside-range-day) {
    color: $calendar-disabled-text-color;
    cursor: not-allowed;
  }

  @include element(selected-day) {
    color: #ffffff;
    background-color: #04969b;

    &:hover {
      background-color: #04969b;
    }
  }
}

@include block(calendar-year) {
  padding: 0 12px;
  text-align: center;

  @include element(quarter) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @include element(single-month) {
    width: 80px;
    padding: 12px 14px;
    cursor: pointer;

    div {
      line-height: 24px;
      border-radius: $calendar-border-radius;
    }

    &:hover div {
      background-color: $calendar-selected-background;
    }
  }

  @include element(outside-range-month) {
    cursor: not-allowed;

    div {
      color: $calendar-disabled-text-color;
    }
  }

  @include element(selected-month) {
    div {
      color: #ffffff;
      background-color: #04969b;
    }

    &:hover div {
      background-color: #04969b;
    }
  }
}



@include block(date-picker) {
  margin-top: 4px;
  border: $calendar-border;
  border-radius: $calendar-border-radius;
  font-size: 14px;
  color: $calendar-text-color;
  background-color: $calendar-background-color;
  box-shadow: $box-shadow;
  user-select: none;

  @include element(input) {
    position: relative;

    input {
      width: 100%;
      padding-right: 32px;
    }
  }

  @include modifier(has-selected-day) {
    &:hover {
      .date-picker__right-icon:first-of-type {
        visibility: hidden;
      }

      .date-picker__right-icon:last-of-type {
        visibility: visible;
      }
    }
  }

  @include element(right-icon) {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
  }

  @include element(close-icon) {
    visibility: hidden;
  }
}
.svg-icon {
  @apply align-middle;
  display: inline-block;
  color: currentColor;
  fill: currentColor;
}

.svg-icon--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.svg-icon--changeable {
  &:hover,
  &:active {
    color: var(--icon-coloured-color);
    fill: var(--icon-coloured-fill);
  }
}

.svg-icon--clickable {
  cursor: pointer;
}

.svg-icon--blue {
  color: var(--blue-600);
  fill: var(--blue-400);
}

.svg-icon--red {
  color: var(--red-600);
  fill: var(--red-400);
}

.svg-icon--green {
  color: var(--green-600);
  fill: var(--green-400);
}

.svg-icon--yellow {
  color: var(--yellow-600);
  fill: var(--yellow-400);
}

.svg-icon--gray {
  color: var(--gray-600);
  fill: var(--gray-400);
}

.svg-icon--pink {
  color: var(--pink-600);
  fill: var(--pink-400);
}

.svg-icon--rose {
  color: var(--rose-600);
  fill: var(--rose-400);
}

.svg-icon--orange {
  color: var(--orange-600);
  fill: var(--orange-400);
}

.svg-icon--white {
  color: var(--icon-light-color);
  fill: var(--icon-light-fill);
}

.svg-icon--primary {
  color: var(--primary-600);
  fill: var(--primary-400);
}
.pop-confirm-content {
  padding: 20px;
  max-width: 374px;
  background: #FFFFFF;
  border: 1px solid var(--gray-300);
  box-sizing: border-box;
  box-shadow: 0px 8px 24px rgba(148, 163, 184, 0.25);
  border-radius: 12px;
}

.pop-confirm-content-btn-box {
  display: flex;
  justify-content: flex-end;
  column-gap: 16px;
  margin-top: 16px;

  .pop-confirm-content-btn {
    border-radius: 8px;
  }

  .pop-confirm-content-btn-cancel {
    @extend .pop-confirm-content-btn;
    border-color: var(--gray-300);

    &:hover {
      border-color: var(--gray-400);
    }
  }

  .pop-confirm-content-btn-ok {
    @extend .pop-confirm-content-btn;
    color: var( --blue-600);
    border-color: var( --blue-600);
    background-color:var( --blue-100);

    &:hover {
      border-color: var( --blue-700);
    }
  }
}
$popperBorderColor: white;
$popperArrowMargin: 8px;
$popperArrowOffset: -4px;

// popper styles
[data-popper-arrow],
[data-popper-arrow]::before {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: -1;
}

[data-popper-arrow]::before {
  content: '';
  transition: transform 0.2s ease-out 0s, visibility 0.2s ease-out 0s;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center center;
}

[data-popper-placement^='top'] > [data-popper-arrow] {
  bottom: -4px;
}

[data-popper-placement^='bottom'] > [data-popper-arrow] {
  top: -4px;
}

[data-popper-placement^='left'] > [data-popper-arrow] {
  right: -4px;
}

[data-popper-placement^='right'] > [data-popper-arrow] {
  left: -4px;
}

@include block(popper-container) {
  border-radius: 4px;
  z-index: $popper-z-index;

  @include modifier(light) {
    background-color: white;

    [data-popper-arrow]::before {
      background-color: white;
    }
  }

  @include modifier(dark) {
    background-color: #182530;

    [data-popper-arrow]::before {
      background-color: #182530;
    }
  }
}

// todo refactor this based on style guide
.popper-tooltip-container {
  max-width: 300px;
  padding: 8px;

  line-height: 1.67;
  color: white;

  border-radius: $border-radius-lg;
  box-shadow: 0 2px 4px 0 rgba(20, 31, 41, 0.3);
}

`;

export default scss;
