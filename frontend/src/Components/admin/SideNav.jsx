import { useNavigate, NavLink } from 'react-router-dom';
import './AdminHome.css';
import {
  FaHome,
  FaTools,
  FaExclamationCircle,
  FaCalendarAlt,
  FaBell,
  FaNewspaper,
  FaCar,
  FaPhoneAlt,
  FaMoneyBillAlt,
} from 'react-icons/fa';

function SideNav() {
  const navigate = useNavigate();

  const navTextStyle = { display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 5px' };
  const iconStyle = { fontSize: '18px' };

  return (
    <div className='Nav_section'>

      <NavLink to="/admin/home" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaHome style={iconStyle} /> Dashboard
        </h3>
      </NavLink>

      <NavLink to="/admin/services" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaTools style={iconStyle} /> Request Services
        </h3>
      </NavLink>

      <NavLink to="/admin/complaints" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaExclamationCircle style={iconStyle} /> Complaints
        </h3>
      </NavLink>

      <NavLink to="/admin/events" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaCalendarAlt style={iconStyle} /> Events
        </h3>
      </NavLink>

      <NavLink to="/admin/notices" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaBell style={iconStyle} /> Notices
        </h3>
      </NavLink>

      <NavLink to="/admin/posts" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaNewspaper style={iconStyle} /> Posts
        </h3>
      </NavLink>

      <NavLink to="/admin/parking" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaCar style={iconStyle} /> Parking
        </h3>
      </NavLink>

      <NavLink to="/admin/emergency" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaPhoneAlt style={iconStyle} /> Emergency Contacts
        </h3>
      </NavLink>

      <NavLink to="/admin/billing" className={({ isActive }) => (isActive ? 'Nav_text active' : 'Nav_text')}>
        <h3 style={navTextStyle}>
          <FaMoneyBillAlt style={iconStyle} /> Billings
        </h3>
      </NavLink>

      {/* Logout Button */}
      <button className="button" onClick={() => navigate('/login')}>
        Logout
      </button>

    </div>
  );
}

export default SideNav;
