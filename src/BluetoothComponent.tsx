import React, { useState } from 'react';

const BluetoothComponent = () => {
  const [device, setDevice] = useState<any>(null);
  const [receivedData, setReceivedData] = useState('');

  const requestBluetoothDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }],
      });
      setDevice(device as any);
      console.log('Подключено к устройству:', device.name);
    } catch (error) {
      console.error('Ошибка подключения:', error);
    }
  };

  const sendData = async () => {
    if (!device) {
      alert('Сначала подключитесь к устройству.');
      return;
    }
    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');

      const dataToSend = new Uint8Array([42]);
      await characteristic.writeValue(dataToSend);

      console.log('Данные отправлены:', dataToSend);
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };

  const receiveData = async () => {
    if (!device) {
      alert('Сначала подключитесь к устройству.');
      return;
    }
    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value.getUint8(0);
        setReceivedData(value);
        console.log('Данные получены:', value);
      });

      await characteristic.startNotifications();
      console.log('Ожидание данных...');
    } catch (error) {
      console.error('Ошибка при приеме данных:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h5>Тест PWA + передача по bluetooth</h5>
      <button className="button" onClick={requestBluetoothDevice}>Подключиться к устройству</button>
      <button className="button" onClick={sendData}>Отправить данные</button>
      <button className="button" onClick={receiveData}>Принимать данные</button>
      {receivedData && <div>Полученные данные: {receivedData}</div>}
    </div>
  );
};

export default BluetoothComponent;
