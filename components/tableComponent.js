import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import { baseURL } from '../constant';

const TableComponent = () => {
    let emptystudent = {
        _id: null,
        Name: '',
        Phone_Number: '',
        School: '',
        Attendance: false,
        Batch: '',
        Date: '',
        Time: '',
        Grade: 0,
        Region: ''
    };
    const router = useRouter();

    const [students, setstudents] = useState(null);
    const [zbatch, setzbatch] = useState(null);
    const [zregion, setzregion] = useState(null);
    const [studentDialog, setstudentDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletestudentDialog, setDeletestudentDialog] = useState(false);
    const [deletestudentsDialog, setDeletestudentsDialog] = useState(false);
    const [student, setstudent] = useState(emptystudent);
    const [selectedstudents, setSelectedstudents] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                // if (!region || !batch) {
                if (router.isReady) {
                    // Code using query
                    var { region, batch } = router.query;
                    setzregion(region);
                    var res = await fetch(`${baseURL}/api/v1/students/${region}/${batch}`);
                    var data = await res.json();
                    // console.log(data);
                    // setbatches(data.region[0].batches);
                    // setregion(data.region[0]);
                    setstudents(data.students);
                    // res = await fetch(`${baseURL}/api/v1/regions?region=${region}&batch=${batch}`);
                    // data = await res.json();
                    setzbatch(data.batch);
                    setLoading(false);
                }
                // console.log(router.asPath);
                // var path = router.asPath.split("region")[1].replaceAll("%20", " ").slice(1,-1);
                // var region = path.split("/")[0];
                // var batch = path.split("/")[1];
                // }
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchStudents();
    }, [router.isReady, router.query]);
    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const openNew = () => {
        setstudent(emptystudent);
        setSubmitted(false);
        setstudentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setstudentDialog(false);
    };

    const hideDeletestudentDialog = () => {
        setDeletestudentDialog(false);
    };

    const hideDeletestudentsDialog = () => {
        setDeletestudentsDialog(false);
    };

    const savestudent = async () => {
        if (student.Name.trim()) {
            let _students = [...students];
            let _student = { ...student };
            setstudents(_students);
            setstudentDialog(false);
            if (student._id) {
                const index = findIndexById(student._id);
                _students[index] = _student;
                try {
                    // setLoading(true);

                    const res = await fetch(`${baseURL}/api/v1/students/${_student._id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(_student)
                    });
                    await res.json();
                    setSubmitted(true);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'student Updated', life: 3000 });
                } catch (err) {
                    console.log(err);
                }
            } else {
                _student.Batch = zbatch;
                _student.Region = zregion;
                _students.push(_student);
                try {
                    // setLoading(true);
                    const res = await fetch(`${baseURL}/api/v1/students`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(_student)
                    });
                    await res.json();
                    setSubmitted(true);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'student Created', life: 3000 });
                } catch (err) {
                    console.log(err);
                }
            }
            setstudent(emptystudent);

        }
    };

    const editstudent = (student) => {
        setstudent({ ...student });
        setstudentDialog(true);
    };

    const addStudent = () => {
        setstudent({ ...emptystudent });
        setstudentDialog(true);
    };

    const confirmDeletestudent = (student) => {
        setstudent(student);
        setDeletestudentDialog(true);
    };

    const deletestudent = async () => {
        let _students = students.filter((val) => val._id !== student._id);
        setstudents(_students);
        setDeletestudentDialog(false);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'student Deleted', life: 3000 });
        try {
            // setLoading(true);
            const res = await fetch(`${baseURL}/api/v1/students/${student._id}`, {
                method: 'DELETE'
            });
            await res.json();
        } catch (err) {
            console.log(err);
        }

        setstudent(emptystudent);
    };

    const takeAttendance = async (index) => {
        const tempStudents = students.map((l) => Object.assign({}, l));
        tempStudents[index].Attendance = !tempStudents[index].Attendance;
        setstudents(tempStudents);
        try {
            // setLoading(true);
            const res = await fetch(`${baseURL}/api/v1/students/${tempStudents[index]._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tempStudents[index])
            });
            await res.json();
        } catch (err) {
            console.log(err);
        }
    };

    // const markAsTaken = async () => {
    //     setzbatch({ ...zbatch, completed: !zbatch.completed });
    //     try {
    //         // setLoading(true);
    //         const res = await fetch(`${baseURL}/api/v1/completed/${zregion}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ batch: zbatch.name })
    //         });
    //         await res.json();
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < students.length; i++) {
            if (students[i]._id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // };

    // const importCSV = (e) => {
    //     const file = e.files[0];
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const csv = e.target.result;
    //         const data = csv.split('\n');

    //         // Prepare DataTable
    //         const cols = data[0].replace(/['"]+/g, '').split(',');
    //         data.shift();

    //         const importedData = data.map((d) => {
    //             d = d.split(',');
    //             const processedData = cols.reduce((obj, c, i) => {
    //                 c = c === 'Status' ? 'inventoryStatus' : c === 'Reviews' ? 'rating' : c.toLowerCase();
    //                 obj[c] = d[i].replace(/['"]+/g, '');
    //                 (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
    //                 return obj;
    //             }, {});

    //             processedData['_id'] = createId();
    //             return processedData;
    //         });

    //         const _students = [...students, ...importedData];

    //         setstudents(_students);
    //     };

    //     reader.readAsText(file, 'UTF-8');
    // };

    // const exportCSV = () => {
    //     dt.current.exportCSV();
    // };

    const confirmDeleteSelected = () => {
        setDeletestudentsDialog(true);
    };

    const deleteSelectedstudents = () => {
        let _students = students.filter((val) => !selectedstudents.includes(val));
        setstudents(_students);
        setDeletestudentsDialog(false);
        setSelectedstudents(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'students Deleted', life: 3000 });
    };

    const onCategoryChange = (e) => {
        let _student = { ...student };
        _student['category'] = e.value;
        setstudent(_student);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _student = { ...student };
        _student[`${name}`] = val;

        setstudent(_student);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _student = { ...student };
        _student[`${name}`] = val;

        setstudent(_student);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedstudents || !selectedstudents.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" onUpload={importCSV} />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    // const imageBodyTemplate = (rowData) => {
    //     return <img src={`images/student/${rowData.image}`} onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={rowData.image} className="student-image" />;
    // };

    // const priceBodyTemplate = (rowData) => {
    //     return formatCurrency(rowData.price);
    // };

    // const ratingBodyTemplate = (rowData) => {
    //     return <Rating value={rowData.rating} readOnly cancel={false} />;
    // };

    // const statusBodyTemplate = (rowData) => {
    //     return <span className={`student-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
    // };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={() => editstudent(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletestudent(rowData)} />
            </React.Fragment>
        );
    };

    const attendanceBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.Attendance && <Button icon="pi pi-check" className="p-button-rounded p-button-check" onClick={() => takeAttendance(students.indexOf(rowData))} />}
                {!rowData.Attendance && <Button icon="pi pi-times" className="p-button-rounded p-button-warning" onClick={() => takeAttendance(students.indexOf(rowData))} />}
            </React.Fragment>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1 text-2xl text-black">Students List</h5>
            <div>
                {/* {zbatch && <Button
                    icon="pi pi-check"
                    label={zbatch.completed ? 'Attendance Taken' : 'Mark as Taken'}
                    className={`p-button ${zbatch.completed ? 'p-button-check' : 'p-button-success'}`}
                    onClick={() => markAsTaken()}
                />} */}
                <Button icon="pi pi-plus" label="Add Student" className="p-button p-button-success" onClick={() => addStudent()} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                </span>
            </div>
        </div>
    );
    const studentDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savestudent} />
        </React.Fragment>
    );
    const deletestudentDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletestudentDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletestudent} />
        </React.Fragment>
    );
    const deletestudentsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletestudentsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedstudents} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}

                <DataTable
                    ref={dt}
                    value={students}
                    selection={selectedstudents}
                    onSelectionChange={(e) => setSelectedstudents(e.value)}
                    dataKey="_id"
                    emptyMessage={loading ? 'Loading...' : 'No Results Found'}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
                    globalFilter={globalFilter}
                    header={header}
                    responsiveLayout="scroll"
                >
                    {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column> */}
                    <Column field="Name" header="Name" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="School" header="School" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="Phone_Number" header="Phone Number" style={{ minWidth: '8rem' }}></Column>
                    <Column body={attendanceBodyTemplate} header="Attendance" field="Attendance" style={{ minWidth: '5rem' }}></Column>
                    {/* <Column field="image" header="Image" body={imageBodyTemplate}></Column> */}
                    {/* <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '5rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={studentDialog} style={{ width: '450px' }} header="Student Details" modal className="p-fluid" footer={studentDialogFooter} onHide={hideDialog}>
                {/* {student.image && (
                    <img src={`images/student/${student.image}`} onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')} alt={student.image} className="student-image block m-auto pb-3" />
                )} */}
                {/* 
Name: '',
        Phone_Number: '',
        School: '',
        Attendance: true,
        Batch: '',
        Date: '',
        Time: '',
        Grade: 0,
        Region: '', */}
                <div className="field">
                    <label htmlFor="Name">Name</label>
                    <InputText id="Name" value={student.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !student.Name })} />
                    {submitted && !student.Name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="Phone_Number">Phone Number</label>
                    <InputText id="Phone_Number" value={student.Phone_Number} onChange={(e) => onInputChange(e, 'Phone_Number')} />
                    {/* {submitted && !student.Name && <small className="p-error">Name is required.</small>} */}
                </div>
                <div className="field">
                    <label htmlFor="School">School</label>
                    <InputText id="School" value={student.School} onChange={(e) => onInputChange(e, 'School')} />
                    {/* {submitted && !student.Name && <small className="p-error">Name is required.</small>} */}
                </div>
                <div className="field">
                    <label htmlFor="Grade">Grade</label>
                    <InputText id="Grade" value={student.Grade} onChange={(e) => onInputChange(e, 'Grade')} />
                    {/* {submitted && !student.Name && <small className="p-error">Name is required.</small>} */}
                </div>

                {/* <div className="field">
                    <label htmlFor="description">Description</label>
                    <InputTextarea id="description" value={student.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={student.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={student.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={student.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={student.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price">Price</label>
                        <InputNumber id="price" value={student.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity">Quantity</label>
                        <InputNumber id="quantity" value={student.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
                    </div>
                </div> */}
            </Dialog>

            <Dialog visible={deletestudentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletestudentDialogFooter} onHide={hideDeletestudentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {student && (
                        <span>
                            Are you sure you want to delete <b>{student.Name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deletestudentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletestudentsDialogFooter} onHide={hideDeletestudentsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {student && <span>Are you sure you want to delete the selected students?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default TableComponent;
