import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../db/sequelize';
import { TicketStatusLogEntity } from "../../../domain/ticket-status-log/ticket-status-log.entity";

export class SequelizeTicketStatusLog extends Model<TicketStatusLogEntity> {
  declare ticstlo_uuid: string;
  declare tic_uuid: string;
  declare usr_uuid: string;
  declare ticstlo_oldstatus: string | null;
  declare ticstlo_newstatus: string;
  declare ticstlo_admincomment: string | null;
  declare ticstlo_createdat: Date;
}

SequelizeTicketStatusLog.init({
  ticstlo_uuid: {
    type: DataTypes.STRING(40), 
    primaryKey: true
  }, 
  tic_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  usr_uuid: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  ticstlo_oldstatus: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ticstlo_newstatus: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  ticstlo_admincomment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ticstlo_createdat: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'ticstlo_createdat',
  updatedAt: false,
  tableName: 'ticstlo_ticketstatuslogs'
});

if (process.env.NODE_ENV !== "production") {
  SequelizeTicketStatusLog.sync();
}
