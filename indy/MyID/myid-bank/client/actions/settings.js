export const CHANGE_BASE = 'CHANGE_BASE'
export const CHANGE_QUOTE = 'CHANGE_QUOTE'
export const CHANGE_TIMEFRAME = 'CHANGE_TIMEFRAME'
export const CHANGE_CANDLE_WIDTH = 'CHANGE_CANDLE_WIDTH'
export const CHANGE_CANDLE_INDEX = 'CHANGE_CANDLE_INDEX'
export const CHANGE_LOADING = 'CHANGE_LOADING'

export const changeBase = data => {
  return {
    type: CHANGE_BASE,
    data
  }
}

export const changeQuote = data => {
  return {
    type: CHANGE_QUOTE,
    data
  }
}

export const changeTimeframe = data => {
  return {
    type: CHANGE_TIMEFRAME,
    data
  }
}

export const changeCandleWidth = data => {
  return {
    type: CHANGE_CANDLE_WIDTH,
    data
  }
}

export const changeCandleIndex = data => {
  return {
    type: CHANGE_CANDLE_INDEX,
    data
  }
}

export const changeLoading = data => {
  console.log('loading', data);
  return {
    type: CHANGE_LOADING,
    data
  }
}
