import React, { useState, useMemo } from 'react';
import Button from '@/components/Form/Button/Button';
import Input from '@/components/Form/Input/Input';
import Select from '@/components/Form/Select/Select';
import { Table } from 'antd';
import s from './OCPInput.module.css';

const OCPInput = () => {
  const [showAddOCPForm, setShowAddOCPForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ocpList, setOcpList] = useState([]);
  const [form, setForm] = useState({ address: '', id: null });
  const [selectedOcpId, setSelectedOcpId] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleCreateOCP = () => setShowAddOCPForm(true);

  const handleSaveOCP = () => {
    if (form.id) {
      setOcpList(ocpList.map(ocp => (ocp.id === form.id ? { ...ocp, address: form.address } : ocp)));
    } else {
      setOcpList([...ocpList, { id: Date.now(), address: form.address }]);
    }
    setShowAddOCPForm(false);
    setForm({ address: '', id: null });
  };

  const handleMatchCourier = () => {
    if (selectedCourier && selectedAddress) {
      console.log(`Сопоставлено: Курьер ${selectedCourier} -> Адрес ${selectedAddress}`);
      // Здесь можно добавить логику сохранения
    }
  };

  const filteredOcpList = useMemo(() => {
    return ocpList.filter(ocp => ocp.address.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [ocpList, searchQuery]);

  const dataSourceOCP = useMemo(() => filteredOcpList.map((ocp) => ({
    key: ocp.id,
    id: ocp.id,
    address: ocp.address
  })), [filteredOcpList]);

  const ocpColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Адрес', dataIndex: 'address', key: 'address' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Button type="second" onClick={() => setSelectedOcpId(record.id)} placeholder="Выбрать" />
      ),
    },
  ];

  return (
    <div className={s.container}>
      {showAddOCPForm && (
        <div className={s.formContainer}>
          <h2 className={s.formTitle}>{form.id ? 'Редактировать OCP' : 'Создать OCP'}</h2>
          <div className={s.form}>
            <Input
              placeholder="Адрес OCP"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={s.input}
            />
            <Button type="primary" placeholder={form.id ? 'Сохранить' : 'Создать'} onClick={handleSaveOCP} className={s.submitButton} />
            <Button type="second" placeholder="Отмена" onClick={() => setShowAddOCPForm(false)} className={s.cancelButton} />
          </div>
        </div>
      )}

      <div className={s.mainContent}>
        <div className={s.leftSide}>
          <div className={s.header}>
            <Input
              placeholder="Поиск OCP"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.searchInput}
            />
            <Button type="primary" onClick={handleCreateOCP} placeholder="Создать OCP" className={s.createButton} />
          </div>

          <Table
            dataSource={dataSourceOCP}
            columns={ocpColumns}
            pagination={false}
            className={s.table}
          />
        </div>

        <div className={s.rightSide}>
          <h2 className={s.sectionTitle}>Назначить доставщика</h2>
          <div className={s.matchForm}>
            <Select
              options={['Курьер 1', 'Курьер 2', 'Курьер 3']}
              placeholder="Выберите доставщика"
              onChange={setSelectedCourier}
              className={s.select}
            />
            <Select
              options={ocpList.map(ocp => ocp.address)}
              placeholder="Выберите адрес"
              onChange={setSelectedAddress}
              className={s.select}
            />
            <Button type="primary" onClick={handleMatchCourier} className={s.matchButton}>Сопоставить</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCPInput;
