import SvgIcon from '../SvgIcon/SvgIcon';
import classes from './Table.module.scss';

type TableProps = {
  data: Record<string, any>[];
  fields: string[];
  id?: string;
  classNames?: string;
  actions?: Record<any, (el: any) => void>; // @TODO fix any
};

const Table = ({
  data,
  fields,
  actions,
  id = '',
  classNames = '',
}: TableProps) => {
  return data?.length ? (
    <table id={id} className={`${classes.commonTable} ${classNames}`}>
      <thead>
        <tr>
          <th>No.</th>
          {fields.map((field) => (
            <th key={`th-key-${field}`}>{field}</th>
          ))}
          <th>...</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((el: any, index: number) => (
            <tr key={`tr-key-${el.id}`}>
              <td width="50" key={`td-key-${index}`}>
                {index + 1}.
              </td>

              {fields.map((field) => (
                <td key={`td-key-${field}-${el.id}`}>{el[field]}</td>
              ))}

              {actions && (
                <td
                  key={`td-key-actions-${el.id}`}
                  className={classes.actionsColumn}
                  width={
                    actions
                      ? (Object.keys(actions).length * 35).toString()
                      : '35'
                  }
                >
                  {Object.entries(actions).map(([key, callback]) => (
                    <SvgIcon
                      key={`icon-${el.id}-action-${key}`}
                      id={`icon-${key}`}
                      elementId={`icon-action-${key}`}
                      onClick={() => callback(el)}
                      width={20}
                      height={20}
                      color="#19202d"
                      hoverColor="#696e76"
                    />
                  ))}
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  ) : (
    <div className={classes.noData}>&#128683; No data</div>
  );
};

export default Table;
