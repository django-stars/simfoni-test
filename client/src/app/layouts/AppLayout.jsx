import Header from './Header'

export default function AppLayout ({ children }) {
  return (
    <div className='wrapper'>
      <Header />
      {children}
    </div>
  )
}
