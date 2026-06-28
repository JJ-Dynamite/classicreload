use axum::{Router, Json, extract::Query};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct GameQuery { platform: Option<String> }

#[derive(Serialize)]
struct Game { id: String, title: String, platform: String, year: u32, image: String, embed_url: String }

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();
    let app = Router::new()
        .route("/", axum::routing::get(root))
        .route("/health", axum::routing::get(health))
        .route("/games", axum::routing::get(get_games))
        .route("/games/:id", axum::routing::get(get_game))
        .layer(tower_http::cors::CorsLayer::permissive());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".into());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await.unwrap();
    tracing::info!("classicreload backend running on :{}", port);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> { Json(serde_json::json!({"service": "classicreload", "status": "running"})) }
async fn health() -> Json<serde_json::Value> { Json(serde_json::json!({"status": "healthy"})) }

async fn get_games(Query(q): Query<GameQuery>) -> Json<serde_json::Value> {
    let platform = q.platform.unwrap_or_else(|| "nes".into());
    let games = vec![
        Game { id: "1".into(), title: "Super Mario Bros".into(), platform: platform.clone(), year: 1985, image: "/img/mario.jpg".into(), embed_url: "/embed/mario".into() },
        Game { id: "2".into(), title: "The Legend of Zelda".into(), platform: platform.clone(), year: 1986, image: "/img/zelda.jpg".into(), embed_url: "/embed/zelda".into() },
    ];
    Json(serde_json::json!({ "games": games, "platform": platform }))
}

async fn get_game(Path(id): Path<String>) -> Json<serde_json::Value> {
    Json(serde_json::json!({ "id": id, "title": "Classic Game", "platform": "nes", "year": 1985, "image": "/img/game.jpg", "embed_url": format!("/embed/{}", id) }))
}
