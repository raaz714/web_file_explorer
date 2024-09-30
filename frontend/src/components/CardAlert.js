export default function CardAlert() {
  return (
    <div className='card bg-info text-info-content m-2'>
      <div className='card-body p-6'>
        <svg
          className='w-6 h-6'
          focusable='false'
          aria-hidden='true'
          viewBox='0 0 24 24'
        >
          <path d='m19.46 8 .79-1.75L22 5.46c.39-.18.39-.73 0-.91l-1.75-.79L19.46 2c-.18-.39-.73-.39-.91 0l-.79 1.75-1.76.79c-.39.18-.39.73 0 .91l1.75.79.79 1.76c.18.39.74.39.92 0M11.5 9.5 9.91 6c-.35-.78-1.47-.78-1.82 0L6.5 9.5 3 11.09c-.78.36-.78 1.47 0 1.82l3.5 1.59L8.09 18c.36.78 1.47.78 1.82 0l1.59-3.5 3.5-1.59c.78-.36.78-1.47 0-1.82zm7.04 6.5-.79 1.75-1.75.79c-.39.18-.39.73 0 .91l1.75.79.79 1.76c.18.39.73.39.91 0l.79-1.75 1.76-.79c.39-.18.39-.73 0-.91l-1.75-.79-.79-1.76c-.18-.39-.74-.39-.92 0'></path>
        </svg>
        <p className='text-wrap'>Expose local server using btunnel</p>
        <div className='card-actions'>
          <a
            role='button'
            className='btn'
            rel='noreferrer'
            href='https://www.btunnel.in'
            target='_blank'
          >
            Go to btunnel
          </a>
        </div>
      </div>
    </div>
  )
}
