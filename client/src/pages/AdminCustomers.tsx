import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CustomerRequest } from "../data/types";

const AdminCustomers = () => {
  const requests = useSelector((state: RootState) => state.admin.customerRequests);
  const customers = useSelector((state: RootState) => state.admin.customers);

  const { passwordChangeRequests, newCustomerRequests } = requests.reduce((acc, request) => {
    const isExistingCustomer = customers.some(customer => customer.email === request.email);

    if (isExistingCustomer) {
      acc.passwordChangeRequests.push(request);
    } else {
      acc.newCustomerRequests.push(request);
    }

    return acc;
  }, { passwordChangeRequests: [] as CustomerRequest[], newCustomerRequests: [] as CustomerRequest[] });

  return (
    <div className='infopage'>
      <div>Запросы на смену пароля</div>
      {passwordChangeRequests.map(request => (
        <div key={request._id}>
          <div>{request.name}</div>
          <div>{request.phone}</div>
        </div>
      ))}

      <div>Запросы от новых клиентов</div>
      {newCustomerRequests.map(request => (
        <div key={request._id}>
          <div>{request.name}</div>
          <div>{request.phone}</div>
        </div>
      ))}
    </div>
  );
};

export default AdminCustomers;
