import React, { useState, useMemo } from 'react';
import Button from '@/components/Form/Button/Button';
import Input from '@/components/Form/Input/Input';
import { Table } from 'antd';
import s from './OCPInput.module.css';

const OCPInput = () => {
  const [showAddOCPForm, setShowAddOCPForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ocpList, setOcpList] = useState([]);
  const [form, setForm] = useState({ address: '', id: null });
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuantity, setItemQuantity] = useState({});
  const [activeOcpId, setActiveOcpId] = useState(null);

  const handleCreateOCP = () => setShowAddOCPForm(true);

  const handleSaveOCP = () => {
    if (form.id) {
      setOcpList(ocpList.map(ocp => (ocp.id === form.id ? { ...ocp, address: form.address } : ocp)));
    } else {
      setOcpList([...ocpList, { id: Date.now(), address: form.address, items: [] }]);
    }
    setShowAddOCPForm(false);
    setForm({ address: '', id: null });
  };

  const handleAddItemToOCP = () => {
    setOcpList(ocpList.map(ocp => {
      if (ocp.id === activeOcpId) {
        const updatedItems = [
          ...ocp.items,
          ...selectedItems.map(item => ({ name: item.name, quantity: itemQuantity[item.name] }))
        ];
        return { ...ocp, items: updatedItems };
      }
      return ocp;
    }));
    setSelectedItems([]);
    setItemQuantity({});
  };

  const handleSelectItem = (item) => {
    if (selectedItems.some(selectedItem => selectedItem.name === item.name)) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.name !== item.name));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleChangeQuantity = (item, quantity) => {
    setItemQuantity({ ...itemQuantity, [item]: quantity });
  };

  const filteredOcpList = useMemo(() => {
    return ocpList.filter(ocp => ocp.address.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [ocpList, searchQuery]);

  const dataSourceOCP = useMemo(() => filteredOcpList.map((ocp) => ({
    key: ocp.id,
    id: ocp.id,
    address: ocp.address,
    items: ocp.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
  })), [filteredOcpList]);

  const ocpColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Адрес', dataIndex: 'address', key: 'address' },
    { title: 'Предметы', dataIndex: 'items', key: 'items' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button type="second" onClick={() => setActiveOcpId(record.id)} placeholder="Выбрать" />
        </>
      ),
    },
  ];

  const selectedOcp = ocpList.find(ocp => ocp.id === activeOcpId) || { items: [] };

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
            onRow={(record) => ({
              onClick: () => setActiveOcpId(record.id),
            })}
          />
        </div>

        <div className={s.rightSide}>
          {activeOcpId ? (
            <>
              <h2 className={s.sectionTitle}>Добавить предметы</h2>
              <div className={s.itemSelection}>
                {['Item1', 'Item2', 'Item3'].map((item, index) => (
                  <div key={index} className={s.itemCheckbox}>
                    <input
                      type="checkbox"
                      id={item}
                      checked={selectedItems.some(selectedItem => selectedItem.name === item)}
                      onChange={() => handleSelectItem({ name: item })}
                    />
                    <label htmlFor={item}>{item}</label>
                    <Input
                      placeholder="Количество"
                      value={itemQuantity[item] || ''}
                      onChange={(e) => handleChangeQuantity(item, e.target.value)}
                      className={s.inputQuantity}
                    />
                  </div>
                ))}
              </div>

              <Button type="primary" onClick={handleAddItemToOCP} className={s.submitButton}>Добавить предметы</Button>
            </>
          ) : (
            <p className={s.placeholderText}>Выберите OCP для добавления предметов</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCPInput;
