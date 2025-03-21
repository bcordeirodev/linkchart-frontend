import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { useState, MouseEvent } from 'react'

interface IAction {
  label: string
  icon? : JSX.Element
  function: () => void
}

interface ICustomMenuProps {
  triggerButton?: JSX.Element
  actions: IAction[]
}

const MenuActions: React.FC<ICustomMenuProps> = ({ actions, triggerButton }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      {triggerButton ? (
        React.cloneElement(triggerButton, {
          onClick: handleClick,
        })
      ) : (
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {actions.map((action, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose()
              action.function()
            }}
          >
            <div
              className="flex justify-center items-center gap-2"
              style={{ width: '100px', height: '20px' }}
            >
              {action.icon && <span>{action.icon}</span>}
              <span>{action.label}</span>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default MenuActions
