import { ref, computed, ComputedRef, Ref } from "vue";
import { useRefHistory, UseRefHistoryReturn } from "@vueuse/core";

import { _NDEFReader as NDEFReader } from "./NDEFReader";

export enum NFCStatus {
  IDLE,
  READING,
  WRITING,
  NOT_SUPPORTED,
}

export interface NFCInterface {
  ndef: NDEFReader;
  status: ComputedRef<NFCStatus>;
  is: (nfcStatus: NFCStatus) => boolean;
  startReading: (timeout?: number) => Promise<any>;
  stopReading: () => void;
  write: (date: any, timeout?: number) => Promise<unknown>;
  abortWrite: () => void;
  latestRead: Ref<NDEFReadingEvent | undefined>;
  latestWrite: Ref<any>;
  error: Ref<string | null>;
  closeNFC: () => void;
  // For testing purposes
  debug: {
    _status: Ref<Array<NFCStatus | null>>;
    _setStatus: (nfcStatus: NFCStatus, value: boolean) => void;
    _statusHistory: UseRefHistoryReturn<NFCStatus, NFCStatus>;
  };
}

const error = ref<string | null>(null);
const _status = ref<Array<NFCStatus | null>>(new Array(4));

/**
 * Returns the highest priority status
 * NOT_SUPPORTED > WRITING > READING > IDLE
 */
const status = computed<NFCStatus>(() => {
  return (
    _status.value.reduce((prev, curr) => {
      prev = prev ? prev : NFCStatus.IDLE;
      curr = curr ? curr : NFCStatus.IDLE;
      return prev > curr ? prev : curr;
    }, NFCStatus.IDLE) || NFCStatus.IDLE
  );
});

const _statusHistory = useRefHistory(status);
const _setStatus = (nfcStatus: NFCStatus, value: boolean) => {
  _status.value[nfcStatus] = value ? nfcStatus : null;
};

_setStatus(NFCStatus.IDLE, true);

if (!("NDEFReader" in window)) {
  error.value = "NFC not supported";
  _setStatus(NFCStatus.NOT_SUPPORTED, true);
}

// Should probably be computed
const is = (nfcStatus: NFCStatus) => (_status.value[nfcStatus] ? true : false);

const ndef = new NDEFReader();
let _ignoreRead = false;

let _readAbort = new AbortController();
let _readTimeout: number;
const latestRead = ref<NDEFReadingEvent>();

let _writeAbort = new AbortController();
let _writeTimeout: number;
const latestWrite = ref();

ndef.addEventListener("reading", (ev) => {
  if (!_ignoreRead) {
    console.log("NFC read ev", ev);
    latestRead.value = ev as NDEFReadingEvent;
  }
});

const startReading = (timeout?: number) => {
  if (_status.value[NFCStatus.READING] === NFCStatus.READING) {
    stopReading();
  }
  _readAbort = new AbortController();
  _setStatus(NFCStatus.READING, true);
  if (timeout) {
    _readTimeout = window.setTimeout(stopReading, timeout);
  }

  return ndef.scan({ signal: _readAbort.signal }).catch((err) => (error.value = err));
};

const stopReading = () => {
  _readAbort.abort();
  clearTimeout(_readTimeout);
  _setStatus(NFCStatus.READING, false);
};

// TODO: Prevent native read immediately after write
// Not sure if this is possible considering we're restricted to browser
const write = (data: any, timeout?: number): Promise<unknown> => {
  if (_status.value[NFCStatus.WRITING] === NFCStatus.WRITING) {
    abortWrite();
  }

  _writeAbort = new AbortController();
  _setStatus(NFCStatus.WRITING, true);

  // A call to write automatically calls a read so we ignore that read here
  _ignoreRead = true;

  if (timeout) {
    _writeTimeout = window.setTimeout(abortWrite, timeout);
  }

  return new Promise((resolve, reject) => {
    _writeAbort.signal.onabort = reject;
    ndef
      .write(data, { signal: _writeAbort.signal })
      .then(() => {
        latestWrite.value = data;
        resolve;
      }, reject)
      .finally(() => {
        clearTimeout(_writeTimeout);
        _ignoreRead = false;
        _setStatus(NFCStatus.WRITING, false);
      });
  });
};

const abortWrite = () => {
  _writeAbort.abort();
  clearTimeout(_writeTimeout);
  _ignoreRead = false;
  _setStatus(NFCStatus.WRITING, false);
};

const closeNFC = () => {
  stopReading();
  abortWrite();
};

export default (): NFCInterface => ({
  ndef,
  status,
  is,
  startReading,
  stopReading,
  write,
  abortWrite,
  latestRead,
  latestWrite,
  closeNFC,
  error,
  debug: {
    _status,
    _setStatus,
    _statusHistory,
  },
});
