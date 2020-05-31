import React from 'react';

const Profile = () => {
    return (
        <div className="profile">
            <div className="profile-card">
                <div>
                    <img className="profile-pic" src="https://images.unsplash.com/photo-1503249023995-51b0f3778ccf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=311&q=80" alt="profile-pic" />
                </div>
                <div className="profile-info">
                    <h4>Sohel Raja</h4>
                    <div className="profile-sub-info">
                        <h6>100 posts</h6>
                        <h6>100 followers</h6>
                        <h6>100 following</h6>
                    </div>
                </div>
            </div>
            <div className="profile-gallery">
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />
                <img className="profile-gallery-item" src="https://images.unsplash.com/photo-1437356934129-02f4dc0872ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60" alt="gallery-pic" />    
            </div>
        </div>
    );
}

export default Profile;